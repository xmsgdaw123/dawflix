import connection from '../database/connection.js'

export const makeQuery = (...query) => new Promise((resolve, reject) => {
  connection.query(...query, (error, results, fields) => {
    if (error) return resolve({ error, data: null })
    resolve({ error: false, data: results })
  })
})