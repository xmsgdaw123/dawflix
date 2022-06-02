import { makeQuery } from '../database/query.js'

export const getFeaturedMovies = async () => {
  const { error, data } = await makeQuery('SELECT movies.* FROM (SELECT * FROM featured_movies LIMIT 5) featured_movies INNER JOIN movies ON featured_movies.movie = movies.id')
  if (error) return null
  if (data.length === 0) return null
  return data
}

export const getMovieById = async id => {
  const { error, data } = await makeQuery('SELECT movies.id, movies.title, movies.director, movies.resume, movies.release_date, movies.is_public, categories.name AS category FROM movies INNER JOIN categories ON movies.category = categories.id WHERE movies.id = ?', [id])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export default {
  getFeaturedMovies,
  getMovieById
}