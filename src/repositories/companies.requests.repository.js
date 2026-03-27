import { pool } from '../database/connectionSupabase.js'

export const createRequest = async (userId, data) => {
  const result = await pool.query(
    `INSERT INTO company_requests
     (user_id, owner_first_name, owner_last_name, contact_phone, ruc, razon_social, company_type, verification_code, code_expires_at, email_verified, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW() + INTERVAL '15 minutes', $9, $10)
     RETURNING *`,
    [
      userId,
      data.owner_first_name,
      data.owner_last_name,
      data.contact_phone,
      data.ruc,
      data.razon_social,
      data.company_type,
      data.verification_code,
      data.email_verified ?? false,
      data.status || 'pending'
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

export const verifyCode = async (userId, code) => {
  const result = await pool.query(
    `UPDATE company_requests
     SET email_verified = true
     WHERE user_id = $1 AND verification_code = $2 AND code_expires_at > NOW()
     RETURNING *`,
    [userId, code]
  )
  return result.rows[0] || null
}

export const getMonthlyRegistrations = async () => {
  const result = await pool.query(`
    SELECT 
      TO_CHAR(created_at, 'YYYY-MM') AS month,
      role,
      COUNT(*) AS count
    FROM users
    WHERE created_at >= NOW() - INTERVAL '6 months'
    GROUP BY month, role
    ORDER BY month ASC
  `)
  return result.rows
}

export const getMonthlyApplications = async () => {
  const result = await pool.query(`
    SELECT 
      TO_CHAR(applied_at, 'YYYY-MM') AS month,
      COUNT(*) AS count
    FROM applies
    WHERE applied_at >= NOW() - INTERVAL '6 months'
    GROUP BY month
    ORDER BY month ASC
  `)
  return result.rows
}

export const getVacancyModalityStats = async () => {
  const result = await pool.query(`
    SELECT modality, COUNT(*) AS count
    FROM vacancies
    WHERE status != 'deleted'
    GROUP BY modality
  `)
  return result.rows
}

export const getApplicationStatusStats = async () => {
  const result = await pool.query(`
    SELECT status, COUNT(*) AS count
    FROM applies
    GROUP BY status
  `)
  return result.rows
}

export const getTopVacancies = async () => {
  const result = await pool.query(`
    SELECT v.title, v.modality, c.company_name, COUNT(a.id) AS applications
    FROM vacancies v
    LEFT JOIN applies a ON a.vacancy_id = v.id
    LEFT JOIN companies c ON c.id = v.company_id
    WHERE v.status != 'deleted'
    GROUP BY v.id, v.title, v.modality, c.company_name
    ORDER BY applications DESC
    LIMIT 5
  `)
  return result.rows
}

export const getWorkScheduleStats = async () => {
  const result = await pool.query(`
    SELECT work_schedule, COUNT(*) AS count
    FROM vacancies
    WHERE status != 'deleted'
    GROUP BY work_schedule
  `)
  return result.rows
}
