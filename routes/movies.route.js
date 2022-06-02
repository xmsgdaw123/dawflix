import { Router } from 'express'
import { savedMoviesPage, getMovieById, saveMovieById, removeSavedMovieById } from '../controllers/movie.controller.js'

export default Router()
  .get('/saved', savedMoviesPage)
  .get('/:id', getMovieById)
  .post('/:id/save', saveMovieById)
  .post('/:id/remove', removeSavedMovieById)