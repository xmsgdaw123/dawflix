import { Router } from 'express'
import { sendScore, renderMoviesPage, getMovieById, saveMovieById, removeSavedMovieById } from '../controllers/movie.controller.js'

export default Router()
  .get('/', renderMoviesPage)
  .get('/:id', getMovieById)
  .post('/:id/save', saveMovieById)
  .post('/:id/remove', removeSavedMovieById)
  .post('/:id/send-score', sendScore)