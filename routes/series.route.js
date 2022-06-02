import { Router } from 'express'
import { getSerieById, saveSerieById, removeSavedSerieById } from '../controllers/series.controller.js'

export default Router()
  .get('/:id', getSerieById)
  .post('/:id/save', saveSerieById)
  .post('/:id/remove', removeSavedSerieById)