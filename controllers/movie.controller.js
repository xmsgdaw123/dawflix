import moviesRepository from '../repositories/movie.repository.js'

export const getMovieById = async (req, res) => {
  const movieId = Number(req.params.id)
  const movie = await moviesRepository.getMovieById(movieId)
  res.render('movie.ejs', {
    movie
  })
}

export const saveMovieById = async (req, res) => {
  const movieId = Number(req.params.id)
  const movie = await moviesRepository.getMovieById(movieId)
  res.render('movie.ejs', {
    movie
  })
}