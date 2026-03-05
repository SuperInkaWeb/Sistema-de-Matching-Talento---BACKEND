import { pool } from '../database/connectionSupabase.js'

export const createVacancy = async (vacancy) => {
  const result = await pool.query(
    `INSERT INTO vacancies
    (company_id, title, description, location, salary_min, salary_max, employment_type)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      vacancy.company_id,
      vacancy.title,
      vacancy.description,
      vacancy.location,
      vacancy.salary_min,
      vacancy.salary_max,
      vacancy.employment_type
    ]
  )

  return result.rows[0]
}

export const getAllVacancies = async () => {
  const result = await pool.query(`
    SELECT v.*, c.company_name
    FROM vacancies v
    JOIN companies c ON v.company_id = c.id
    WHERE status != 'deleted'
    ORDER BY v.created_at DESC
  `)

  return result.rows
}

export const getVacancyById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM vacancies WHERE id = $1 AND status !=deleted',
    [id]
  )

  return result.rows[0]
}

export const updateVacancy = async (id, vacancy) => {
  const result = await pool.query(
    `UPDATE vacancies
     SET title=$1,
         description=$2,
         location=$3,
         salary_min=$4,
         salary_max=$5,
         employment_type=$6,
         status=$7,
         updated_at = CURRENT_TIMESTAMP
     WHERE id=$8
     AND status !=deleted
     RETURNING *`,
    [
      vacancy.title,
      vacancy.description,
      vacancy.location,
      vacancy.salary_min,
      vacancy.salary_max,
      vacancy.employment_type,
      vacancy.status,
      id
    ]
  )

  return result.rows[0]
}

export const getVacanciesByCompanyId = async (companyId) => {
  const result = await pool.query(
    `SELECT *
     FROM vacancies
     WHERE company_id = $1
     AND status !=deleted
     ORDER BY created_at DESC`,
    [companyId]
  )

  return result.rows
}

export const deleteVacancy = async (id) => {
  const result = await pool.query(
    `UPDATE vacancies
     SET status = 'deleted',
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  )

  return result.rows[0]
}
