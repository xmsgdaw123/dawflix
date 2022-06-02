import { Router } from 'express'
import { getMovieById, saveMovieById } from '../controllers/movie.controller.js'

export default Router()
  .get('/:id', getMovieById)
  .post('/:id/save', saveMovieById)