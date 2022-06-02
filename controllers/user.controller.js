import { createUser, getUserByEmail, getUserById, updateNameAndEmailById, updatePasswordById } from '../repositories/user.repository.js'
import { comparePassword, hashPassword } from '../services/user.service.js'

export const handleLogin = async (req, res) => {
  if (!req.body?.email || !req.body.password) {
    return res.status(400).send({
      status: 'error',
      message: 'Body incorrecto'
    })
  }

  const user = await getUserByEmail(req.body.email)
  if (!user) {
    return res.status(400).send({
      status: 'error',
      message: 'Usuario no encontrado'
    })
  }

  // todo: comparar hash

  req.session.user = user

  res.send({ status: 'success' })
}

export const handleRegister = async (req, res) => {
  if (!req.body?.name || !req.body?.email || !req.body.password) {
    return res.status(400).send({
      status: 'error',
      message: 'Body incorrecto'
    })
  }

  const { name, email, password } = req.body

  const user = await getUserByEmail(email)
  if (user) {
    return res.status(400).send({
      status: 'error',
      message: 'Ya existe un usuario con ese correo'
    })
  }

  const passwordHash = await hashPassword(password)
  const { error, data } = await createUser(name, email, passwordHash)
  if (error) {
    return res.status(400).send({
      status: 'error',
      message: 'Error al crear el nuevo usuario'
    })
  }

  const newUser = await getUserById(data.insertId)
  req.session.user = newUser

  res.send({ status: 'success' })
}

export const handleLogout = async (req, res) => {
  req.session = null
  res.redirect('/')
}

export const updateProfile = async (req, res) => {
  if (!req.body?.name || !req.body?.email) {
    return res.status(400).send({
      status: 'error',
      message: 'Body incorrecto'
    })
  }

  const { name, email } = req.body

  const user = await getUserById(req.session.user.id)
  if (!user) {
    return res.status(400).send({
      status: 'error',
      message: 'Usuario no encontrado'
    })
  }

  const existingEmail = await getUserByEmail(email)
  if (existingEmail && existingEmail.id !== req.session.user.id) {
    return res.status(400).send({
      status: 'error',
      message: 'Ya existe un usuario con ese correo'
    })
  }

  await updateNameAndEmailById(req.session.user.id, name, email)

  // si introduce un campo pero no el otro
  if (req.body?.currentPassword && !req.body?.updatedPassword
    || !req.body?.currentPassword && req.body?.updatedPassword) {
    return res.status(400).send({
      status: 'error',
      message: 'Falta completar la contraseña actual/nueva'
    })
  }


  if (req.body?.currentPassword && req.body?.updatedPassword) {
    const isValidPassword = await comparePassword(req.body.currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(400).send({
        status: 'error',
        message: 'La contraseña actual no coincide'
      })
    }

    const newPasswordHash = await hashPassword(req.body.updatedPassword)
    await updatePasswordById(req.session.user.id, newPasswordHash)
  }

  const updatedUser = await getUserById(req.session.user.id)
  req.session.user = updatedUser

  res.send({ status: 'success' })
}