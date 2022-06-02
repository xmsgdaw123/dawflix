import { Router } from 'express'
import { handleLogin, handleRegister, handleLogout } from '../controllers/user.controller.js'


export default Router()
  .post('/login', handleLogin)
  .post('/register', handleRegister)
  .get('/logout', handleLogout)