import {
  createInvitation,
  getInvitationByToken,
  acceptInvitation,
  getMyInvitations,
  countMyInvitations,
  getAllInvitations
} from '../repositories/invitations.repository.js'
import { sendInvitationEmail } from './email.service.js'

const CANDIDATE_LIMIT = 5

export const sendInvitationService = async (inviterId, inviterRole, email, role) => {
  if (inviterRole === 'candidate') {
    if (role !== 'candidate') {
      const error = new Error('Los candidatos solo pueden invitar a otros candidatos')
      error.status = 403
      throw error
    }
    const count = await countMyInvitations(inviterId)
    if (count >= CANDIDATE_LIMIT) {
      const error = new Error(`Has alcanzado el límite de ${CANDIDATE_LIMIT} invitaciones`)
      error.status = 400
      throw error
    }
  }

  const invitation = await createInvitation({
    email,
    role,
    invited_by: inviterId,
    invited_by_role: inviterRole
  })

  await sendInvitationEmail(email, invitation.token, role)

  return { message: 'Invitación enviada', invitation }
}

export const getInvitationService = async (token) => {
  const invitation = await getInvitationByToken(token)
  if (!invitation) {
    const error = new Error('Invitación inválida o expirada')
    error.status = 404
    throw error
  }
  return invitation
}

export const acceptInvitationService = async (token) => {
  const invitation = await acceptInvitation(token)
  if (!invitation) {
    const error = new Error('Invitación no encontrada')
    error.status = 404
    throw error
  }
  return invitation
}

export const getMyInvitationsService = async (userId) => {
  return await getMyInvitations(userId)
}

export const getAllInvitationsService = async () => {
  return await getAllInvitations()
}
