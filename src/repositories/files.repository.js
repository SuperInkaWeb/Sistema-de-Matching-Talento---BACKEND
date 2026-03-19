import { pool } from '../database/connectionSupabase.js'

export const deactivatePreviousResumes = async (profileId) => {
  await pool.query(
    `
    UPDATE candidates_files
    SET is_active = false
    WHERE candidate_profile_id = $1
      AND file_type = 'resume'
      AND is_active = true
    `,
    [profileId]
  )
}

export const createCandidateFile = async (profileId, fileData) => {
  const result = await pool.query(
    `
    INSERT INTO candidates_files (
      candidate_profile_id,
      file_name,
      file_url,
      file_type
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      profileId,
      fileData.file_name,
      fileData.file_url,
      fileData.file_type
    ]
  )

  return result.rows[0]
}

export const getCandidateCV = async (candidateProfileId) => {
  const result = await pool.query(
    `SELECT id, file_url, file_name
     FROM candidates_files
     WHERE candidate_profile_id = $1
       AND file_type = 'resume'
       AND is_active = true
     ORDER BY created_at DESC
     LIMIT 1`,
    [candidateProfileId]
  )
  return result.rows[0] || null
}

export const getCVByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT f.* FROM candidate_files f
     JOIN candidates_profile p ON p.id = f.candidate_profile_id
     WHERE p.user_id = $1
     AND f.file_type = 'resume'
     AND f.is_active = true
     ORDER BY f.created_at DESC
     LIMIT 1`,
    [userId]
  )
  return result.rows[0] || null
}
