import { makeQuery } from '../database/query.js'

export const getFeaturedSeries = async () => {
  const { error, data } = await makeQuery('SELECT series.* FROM (SELECT * FROM featured_series LIMIT 5) featured_series INNER JOIN series ON featured_series.serie = series.id')
  if (error) return null
  if (data.length === 0) return null
  return data
}

export const getSerieById = async id => {
  const { error, data } = await makeQuery('SELECT series.id, series.title, series.director, series.resume, series.release_date, series.is_public, categories.name AS category FROM series INNER JOIN categories ON series.category = categories.id WHERE series.id = ?', [id])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export const getSavedSerie = async (userId, serieId) => {
  const { error, data } = await makeQuery('SELECT * FROM saved_series WHERE user = ? AND serie = ?', [userId, serieId])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export const saveSerie = async (userId, serieId, savedAt) => {
  const { error, data } = await makeQuery('INSERT INTO saved_series (user, serie, saved_at) VALUES (?, ?, ?)', [userId, serieId, savedAt])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export const getSavedSeries = async userId => {
  const { error, data } = await makeQuery('SELECT * FROM saved_series WHERE user = ?', [userId])
  console.log(error, data)
  if (error) return null
  if (data.length === 0) return null
  return data
}

export const getSavedSeriesDetailed = async userId => {
  const { error, data } = await makeQuery('SELECT series.id, series.title, series.director, series.resume, series.release_date, series.is_public, categories.name AS category, saved_series.saved_at FROM saved_series INNER JOIN series ON series.id = saved_series.serie INNER JOIN categories ON series.category = categories.id WHERE saved_series.user = ?', [userId])
  if (error) return null
  if (data.length === 0) return null
  return data
}

export const removeSavedSerie = async (userId, serieId) => {
  const { error, data } = await makeQuery('DELETE FROM saved_series WHERE user = ? AND serie = ?', [userId, serieId])
  if (error) return null
  if (data.length === 0) return null
  return data
}

export default {
  getFeaturedSeries,
  getSerieById,
  getSavedSerie,
  saveSerie,
  getSavedSeries,
  removeSavedSerie,
  getSavedSeriesDetailed
}