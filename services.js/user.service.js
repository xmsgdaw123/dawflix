import bcrypt from 'bcrypt'

const saltRounds = 10

export const hashPassword = async password => {
  const hash = await bcrypt.hash(password, saltRounds)
  return hash
}