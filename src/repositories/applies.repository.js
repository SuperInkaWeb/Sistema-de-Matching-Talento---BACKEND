import { pool } from '../database/connectionSupabase.js'

export const createApply = async (candidateProfileId, vacancyId) => {
  const result = await pool.query(
    `INSERT INTO applies (candidate_profile_id, vacancy_id)
     VALUES ($1, $2)
     RETURNING *`,
    [candidateProfileId, vacancyId]
  )

  return result.rows[0]
}

export const getAppliesByCandidate = async (candidateProfileId) => {
  const result = await pool.query(
    `SELECT
        a.id,
        a.vacancy_id,
        a.status,
        a.applied_at,
        v.title,
        v.location,
        v.modality,
        v.work_schedule,
        v.salary_min,
        v.salary_max,
        c.company_name
     FROM applies a
     JOIN vacancies v ON v.id = a.vacancy_id
     LEFT JOIN companies c ON c.id = v.company_id
     WHERE a.candidate_profile_id = $1
     ORDER BY a.applied_at DESC`,
    [candidateProfileId]
  )
  return result.rows
}

export const getApplicantsByVacancy = async (vacancyId) => {
  const result = await pool.query(
    `SELECT
        a.id AS apply_id,
        a.status,
        a.applied_at,
        c.id AS candidate_profile_id,
        c.first_name,
        c.last_name,
        c.city,
        c.country,
        c.skills,
        c.experience_years,
        c.resume_url
     FROM applies a
     JOIN candidates_profile c
       ON c.id = a.candidate_profile_id
     WHERE a.vacancy_id = $1
     ORDER BY a.applied_at DESC`,
    [vacancyId]
  )

  return result.rows
}

export const updateApplyStatus = async (applyId, status) => {
  const result = await pool.query(
    'UPDATE applies SET status = $1 WHERE id = $2 RETURNING *',
    [status, applyId]
  )
  return result.rows[0]
}
