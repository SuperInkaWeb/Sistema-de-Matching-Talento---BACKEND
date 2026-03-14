import { pool } from '../database/connectionSupabase.js'

export const createRequest = async (userId, data) => {
  const result = await pool.query(
    `INSERT INTO company_requests (user_id, company_name, description, industry, website_url, city, country)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      userId,
      data.company_name,
      data.description || null,
      data.industry || null,
      data.website_url || null,
      data.city || null,
      data.country || null
    ]
  )
  return result.rows[0]
}

export const getMyRequest = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM company_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [userId]
  )
  return result.rows[0] || null
}

export const getAllRequests = async () => {
  const result = await pool.query(
    `SELECT cr.*, u.email, u.name
     FROM company_requests cr
     JOIN users u ON u.id = cr.user_id
     ORDER BY cr.created_at DESC`
  )
  return result.rows
}

export const updateRequestStatus = async (requestId, status) => {
  const result = await pool.query(
    'UPDATE company_requests SET status=$1 WHERE id=$2 RETURNING *',
    [status, requestId]
  )
  return result.rows[0]
}

export const getGlobalStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'candidate') AS total_candidates,
      (SELECT COUNT(*) FROM users WHERE role = 'company') AS total_companies,
      (SELECT COUNT(*) FROM vacancies WHERE status = 'open') AS active_vacancies,
      (SELECT COUNT(*) FROM applies) AS total_applies,
      (SELECT COUNT(*) FROM company_requests WHERE status = 'pending') AS pending_requests
  `)
  return result.rows[0]
}

export const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT 
      u.id, u.name, u.email, u.role, u.created_at,
      c.company_name, c.description as company_description,
      c.industry, c.city, c.country, c.website_url
     FROM users u
     LEFT JOIN companies c ON c.user_id = u.id
     ORDER BY u.created_at DESC`
  )
  return result.rows
}

export const getAllVacanciesAdmin = async () => {
  const result = await pool.query(
    `SELECT v.*, c.company_name FROM vacancies v
     LEFT JOIN companies c ON c.id = v.company_id
     WHERE v.status != 'deleted'
     ORDER BY v.created_at DESC`
  )
  return result.rows
}
