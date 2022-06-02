import moviesRepository from '../repositories/movie.repository.js'

export const getMovieById = async (req, res) => {
  const movieId = Number(req.params.id)
  const savedMovies = await moviesRepository.getSavedMovies(req.session.user.id)
  const movie = await moviesRepository.getMovieById(movieId)
  res.render('movie.ejs', {
    movie,
    savedMovies
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