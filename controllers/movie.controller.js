import moviesRepository from '../repositories/movie.repository.js'

export const getMovieById = async (req, res) => {
  const movieId = Number(req.params.id)
  const savedMovies = await moviesRepository.getSavedMovies(req.session.user.id)
  const movie = await moviesRepository.getMovieById(movieId)
  const scores = await moviesRepository.getScores(movieId)
  const averageScore = await moviesRepository.getAverageScore(movieId)

  res.render('movie.ejs', {
    movie,
    savedMovies,
    scores,
    averageScore
  })
}

export const saveMovieById = async (req, res) => {
  const userId = req.session.user.id
  const movieId = Number(req.params.id)
  const movie = await moviesRepository.getMovieById(movieId)
  if (!movie) {
    return res.status(400).send({
      status: 'error',
      message: 'La película solicitada no existe'
    })
  }

  const alreadySaved = await moviesRepository.getSavedMovie(userId, movieId)
  if (alreadySaved) {
    return res.status(400).send({
      status: 'error',
      message: 'Ya has guardado esta película'
    })
  }

  const savedAt = Date.now()
  await moviesRepository.saveMovie(userId, movieId, savedAt)

  res.send({ status: 'success' })
}

export const removeSavedMovieById = async (req, res) => {
  const userId = req.session.user.id
  const movieId = Number(req.params.id)
  const movie = await moviesRepository.getMovieById(movieId)
  if (!movie) {
    return res.status(400).send({
      status: 'error',
      message: 'La película solicitada no existe'
    })
  }

  await moviesRepository.removeSavedMovie(userId, movieId)

  res.send({ status: 'success' })
}

export const renderMoviesPage = async (req, res) => {
  const movies = await moviesRepository.getAllMovies()

  res.render('movies.ejs', {
    movies
  })
}

export const sendScore = async (req, res) => {
  const userId = req.session.user.id
  const movieId = Number(req.params.id)

  if (!req.body?.stars || !req.body.text) {
    return res.status(400).send({
      status: 'error',
      message: 'Body incorrecto'
    })
  }

  const { stars, text } = req.body
  await moviesRepository.saveScore(stars, text, userId, movieId)

  res.send({ status: 'success' })
}