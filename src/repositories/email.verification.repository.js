import { pool } from '../database/connectionSupabase.js'

export const upsertVerificationCode = async (email, code) => {
  const result = await pool.query(
    `INSERT INTO email_verifications (email, code, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '15 minutes')
     ON CONFLICT (email) DO UPDATE SET code=$2, expires_at=NOW() + INTERVAL '15 minutes'
     RETURNING *`,
    [email, code]
  )
  return result.rows[0]
}

export const findValidCode = async (email, code) => {
  const result = await pool.query(
    'SELECT * FROM email_verifications WHERE email=$1 AND code=$2 AND expires_at > NOW()',
    [email, code]
  )
  return result.rows[0] || null
}

export const deleteVerificationCode = async (email) => {
  await pool.query('DELETE FROM email_verifications WHERE email=$1', [email])
}

export const findOrCreateUser = async (email, firstName, lastName) => {
  let result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  if (result.rows[0]) return result.rows[0]

  const { randomUUID } = await import('crypto')
  result = await pool.query(
    `INSERT INTO users (auth0_id, email, role, name)
     VALUES ($1, $2, 'candidate', $3) RETURNING *`,
    [`pending_${randomUUID()}`, email, `${firstName} ${lastName}`]
  )
  return result.rows[0]
}
