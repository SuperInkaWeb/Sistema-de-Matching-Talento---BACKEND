import { pool } from '../database/connectionSupabase.js'

export const createCompany = async (data) => {
  const result = await pool.query(
    `INSERT INTO companies (
      user_id,
      company_name,
      description,
      industry,
      website_url,
      logo_url,
      company_size,
      city,
      country
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      data.user_id,
      data.company_name,
      data.description,
      data.industry,
      data.website_url,
      data.logo_url,
      data.company_size,
      data.city,
      data.country
    ]
  )

  return result.rows[0]
}

export const getCompanyByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT id FROM companies WHERE user_id = $1',
    [userId]
  )

  return result.rows[0]
}

export const updateCompany = async (userId, data) => {
  const result = await pool.query(
    `UPDATE companies
     SET company_name = $1,
         description = $2,
         industry = $3,
         website_url = $4,
         logo_url = $5,
         company_size = $6,
         city = $7,
         country = $8
     WHERE user_id = $9
     RETURNING *`,
    [
      data.company_name,
      data.description,
      data.industry,
      data.website_url,
      data.logo_url,
      data.company_size,
      data.city,
      data.country,
      userId
    ]
  )

  return result.rows[0]
}

export const deleteCompany = async (userId) => {
  await pool.query(
    'DELETE FROM companies WHERE user_id = $1',
    [userId]
  )
}
