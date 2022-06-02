import { makeQuery } from '../database/query.js'

export const getFeaturedSeries = async () => {
  const { error, data } = await makeQuery('SELECT series.* FROM (SELECT * FROM featured_series LIMIT 5) featured_series INNER JOIN series ON featured_series.movie = series.id')
  if (error) return null
  if (data.length === 0) return null
  return data
}