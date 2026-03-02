import { pool } from '../database/connectionPostgreSQL.js'

// Buscar usuario por auth0_id
export const findUserByAuth0Id = async (auth0Id) => {
  const result = await pool.query(
    `SELECT id, auth0_id, email, role, created_at
     FROM users
     WHERE auth0_id = $1`,
    [auth0Id]
  )

  return result.rows[0] || null
}

// Crear usuario
export const createUser = async ({ auth0Id, email }) => {
  const result = await pool.query(
    `INSERT INTO users (auth0_id, email)
     VALUES ($1, $2)
     RETURNING id, auth0_id, email, role, created_at`,
    [auth0Id, email]
  )

  return result.rows[0]
}
