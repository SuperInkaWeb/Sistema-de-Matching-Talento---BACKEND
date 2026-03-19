import { pool } from '../database/connectionSupabase.js'
import crypto from 'crypto'

export const createInvitation = async (data) => {
  const token = crypto.randomUUID()
  const result = await pool.query(
    `INSERT INTO invitations (token, email, role, invited_by, invited_by_role, expires_at)
     VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '7 days')
     RETURNING *`,
    [token, data.email, data.role, data.invited_by, data.invited_by_role]
  )
  return result.rows[0]
}

export const getInvitationByToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM invitations WHERE token=$1 AND expires_at > NOW() AND accepted=false',
    [token]
  )
  return result.rows[0] || null
}

export const acceptInvitation = async (token) => {
  const result = await pool.query(
    `UPDATE invitations SET accepted=true, accepted_at=NOW()
     WHERE token=$1 RETURNING *`,
    [token]
  )
  return result.rows[0] || null
}

export const getMyInvitations = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM invitations WHERE invited_by=$1 ORDER BY created_at DESC',
    [userId]
  )
  return result.rows
}

export const countMyInvitations = async (userId) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM invitations WHERE invited_by=$1',
    [userId]
  )
  return parseInt(result.rows[0].count)
}

export const getAllInvitations = async () => {
  const result = await pool.query(
    `SELECT i.*, u.name AS inviter_name, u.email AS inviter_email
     FROM invitations i
     LEFT JOIN users u ON u.id = i.invited_by
     ORDER BY i.created_at DESC`
  )
  return result.rows
}
