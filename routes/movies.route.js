import { Router } from 'express'
import { getMovieById, saveMovieById, removeSavedMovieById } from '../controllers/movie.controller.js'

export default Router()
  .get('/:id', getMovieById)
  .post('/:id/save', saveMovieById)
  .post('/:id/remove', removeSavedMovieById)