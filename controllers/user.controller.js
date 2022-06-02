import { createUser, getUserByEmail, getUserById, updateNameAndEmailById } from '../repositories/user.repository.js'
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

  // const isValidPassword = await comparePassword(password, user.password)
  // if (!isValidPassword) {
  //   return res.status(400).send({
  //     status: 'error',
  //     message: 'Contraseña incorrecta'
  //   })
  // }

  // await updateUserById(req.session.user.id, name, email, password)

  const updatedUser = await getUserById(req.session.user.id)
  req.session.user = updatedUser

  res.send({ status: 'success' })
}