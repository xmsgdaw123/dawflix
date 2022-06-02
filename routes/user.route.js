import { Router } from 'express'
import { updateProfile } from '../controllers/user.controller.js'


export default Router()
  .post('/update-profile', updateProfile)