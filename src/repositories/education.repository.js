import { pool } from '../database/connectionSupabase.js'

export const getEducationByProfileId = async (profileId) => {
  const result = await pool.query(
    'SELECT * FROM candidate_education WHERE candidate_profile_id = $1 ORDER BY start_year DESC',
    [profileId]
  )
  return result.rows
}

export const addEducation = async (profileId, data) => {
  const result = await pool.query(
    `INSERT INTO candidate_education
     (candidate_profile_id, institution, career, level, status, start_year, end_year)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [profileId, data.institution, data.career, data.level, data.status, data.start_year, data.end_year || null]
  )
  return result.rows[0]
}

export const updateEducation = async (id, profileId, data) => {
  const result = await pool.query(
    `UPDATE candidate_education
     SET institution=$1, career=$2, level=$3, status=$4, start_year=$5, end_year=$6
     WHERE id=$7 AND candidate_profile_id=$8 RETURNING *`,
    [data.institution, data.career, data.level, data.status, data.start_year, data.end_year || null, id, profileId]
  )
  return result.rows[0]
}

export const deleteEducation = async (id, profileId) => {
  const result = await pool.query(
    'DELETE FROM candidate_education WHERE id=$1 AND candidate_profile_id=$2 RETURNING *',
    [id, profileId]
  )
  return result.rows[0]
}
