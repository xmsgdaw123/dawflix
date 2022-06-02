import { makeQuery } from '../database/query.js'

export const getUserById = async id => {
  const { error, data } = await makeQuery('SELECT * FROM users WHERE id = ?', [id])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export const getUserByEmail = async email => {
  const { error, data } = await makeQuery('SELECT * FROM users WHERE email = ?', [email])
  if (error) return null
  if (data.length === 0) return null
  return data[0]
}

export const createUser = async (name, email, passwordHash) => {
  return makeQuery(`INSERT INTO users (username, email, password, role, is_subscriber) VALUES (?, ?, ?, 'user', 0)`, [name, email, passwordHash])
}

export const updateNameAndEmailById = async (id, name, email) => {
  return await makeQuery(`UPDATE users SET username = ?, email = ? WHERE id = ?`, [name, email, id])
}