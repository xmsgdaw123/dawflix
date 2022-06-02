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

export const getSavedMovie = async (userId, movieId) => {
  const { error, data } = await makeQuery('SELECT * FROM saved_movies WHERE user = ? AND movie = ?', [userId, movieId])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export const saveMovie = async (userId, movieId, savedAt) => {
  const { error, data } = await makeQuery('INSERT INTO saved_movies (user, movie, saved_at) VALUES (?, ?, ?)', [userId, movieId, savedAt])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export const getSavedMovies = async userId => {
  const { error, data } = await makeQuery('SELECT * FROM saved_movies WHERE user = ?', [userId])
  if (error) return null
  if (data.length === 0) return null
  return data
}

export const getSavedMoviesDetailed = async userId => {
  const { error, data } = await makeQuery('SELECT movies.id, movies.title, movies.director, movies.resume, movies.release_date, movies.is_public, categories.name AS category, saved_movies.saved_at FROM saved_movies INNER JOIN movies ON movies.id = saved_movies.movie INNER JOIN categories ON movies.category = categories.id WHERE saved_movies.user = ?', [userId])
  if (error) return null
  if (data.length === 0) return null
  return data
}

export const removeSavedMovie = async (userId, movieId) => {
  const { error, data } = await makeQuery('DELETE FROM saved_movies WHERE user = ? AND movie = ?', [userId, movieId])
  if (error) return null
  if (data.length === 0) return null
  return data
}

export default {
  getFeaturedMovies,
  getMovieById,
  getSavedMovie,
  saveMovie,
  getSavedMovies,
  removeSavedMovie,
  getSavedMoviesDetailed
}