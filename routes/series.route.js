import { Router } from 'express'
import { sendScore, renderSeriesPage, getSerieById, saveSerieById, removeSavedSerieById } from '../controllers/series.controller.js'

export default Router()
  .get('/', renderSeriesPage)
  .get('/:id', getSerieById)
  .post('/:id/save', saveSerieById)
  .post('/:id/remove', removeSavedSerieById)
  .post('/:id/send-score', sendScore)