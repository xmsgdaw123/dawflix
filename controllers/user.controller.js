import { createUser, getUserByEmail, getUserById } from '../repositories/user.repository.js'
import { hashPassword } from '../services/user.service.js'


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