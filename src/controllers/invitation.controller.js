import {
  sendInvitationService,
  getInvitationService,
  acceptInvitationService,
  getMyInvitationsService,
  getAllInvitationsService
} from '../services/invitation.service.js'
import { awardPoints } from '../services/points.service.js'

export const sendInvitation = async (req, res) => {
  try {
    const { email, role } = req.body
    const inviterRole = req.dbUser.role
    const result = await sendInvitationService(req.dbUser.id, inviterRole, email, role || 'candidate')
    await awardPoints(req.dbUser.id, 'INVITE_USER')
    res.status(201).json(result)
  } catch (err) {
    console.error('sendInvitation error:', err.message)
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const getInvitation = async (req, res) => {
  try {
    const result = await getInvitationService(req.params.token)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const acceptInvitation = async (req, res) => {
  try {
    const result = await acceptInvitationService(req.params.token)
    res.json(result)
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

export const getMyInvitations = async (req, res) => {
  try {
    const result = await getMyInvitationsService(req.dbUser.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getAllInvitations = async (req, res) => {
  try {
    const result = await getAllInvitationsService()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
