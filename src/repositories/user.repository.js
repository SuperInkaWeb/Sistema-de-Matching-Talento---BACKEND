import { pool } from '../database/connectionSupabase.js'

export const findUserByAuth0Id = async (auth0Id) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE auth0_id = $1',
    [auth0Id]
  )
  return result.rows[0] || null
}

export const upsertUser = async ({ auth0Id, email, name, picture }) => {
  const result = await pool.query(
    `INSERT INTO users (auth0_id, email, name, picture)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (auth0_id)
     DO UPDATE SET
       email   = EXCLUDED.email,
       name    = EXCLUDED.name,
       picture = EXCLUDED.picture
     RETURNING *`,
    [auth0Id, email, name || null, picture || null]
  )
  return result.rows[0]
}

export const createUser = async ({ auth0_id, email }) => {
  const result = await pool.query(
    `INSERT INTO users (auth0_id, email)
     VALUES ($1, $2)
     RETURNING *`,
    [auth0_id, email]
  )
  return result.rows[0]
}

export const updateUserRole = async (userId, newRole) => {
  const result = await pool.query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
    [newRole, userId]
  )
  return result.rows[0]
}
