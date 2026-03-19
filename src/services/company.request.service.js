import {
  createRequest,
  getMyRequest,
  getAllRequests,
  updateRequestStatus,
  getGlobalStats,
  verifyCode
} from '../repositories/companies.requests.repository.js'
import { updateUserRole } from '../repositories/user.repository.js'
import { createCompany } from '../repositories/companies.repository.js'
import { getRucInfo } from './sunat.service.js'
import { sendVerificationEmail, sendApprovalEmail, sendRejectionEmail } from './email.service.js'

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString()

export const createRequestService = async (userId, userEmail, data) => {
  const { owner_first_name, owner_last_name, contact_phone, ruc, company_type } = data

  if (!/^\d{11}$/.test(ruc)) {
    const error = new Error('El RUC debe tener 11 dígitos')
    error.status = 400
    throw error
  }

  const rucInfo = await getRucInfo(ruc)
  if (rucInfo.estado !== 'ACTIVO') {
    const error = new Error('El RUC no está activo en SUNAT')
    error.status = 400
    throw error
  }

  const existing = await getMyRequest(userId)
  if (existing && existing.status === 'pending' && existing.email_verified) {
    const error = new Error('Ya tienes una solicitud pendiente en revisión')
    error.status = 400
    throw error
  }

  const code = generateCode()

  const request = await createRequest(userId, {
    ...data,
    razon_social: rucInfo.razon_social,
    verification_code: code
  })

  await sendVerificationEmail(userEmail, code, owner_first_name)

  return {
    message: 'Solicitud enviada. Revisa tu correo para verificar.',
    request_id: request.id,
    razon_social: rucInfo.razon_social
  }
}

export const verifyEmailService = async (userId, code) => {
  const request = await verifyCode(userId, code)
  if (!request) {
    const error = new Error('Código inválido o expirado')
    error.status = 400
    throw error
  }
  return { message: 'Correo verificado. Tu solicitud está en revisión.' }
}

export const getMyRequestService = async (userId) => {
  return await getMyRequest(userId)
}

export const getAllRequestsService = async () => {
  return await getAllRequests()
}

export const resolveRequestService = async (requestId, status, userEmail) => {
  const request = await updateRequestStatus(requestId, status)
  if (!request) throw new Error('REQUEST_NOT_FOUND')

  if (status === 'accepted') {
    await updateUserRole(request.user_id, 'company')
    await createCompany(request.user_id, {
      company_name: request.razon_social || request.company_name,
      description: request.description || '',
      industry: request.industry || '',
      website_url: request.website_url || '',
      logo_url: null,
      company_size: null,
      city: request.city || '',
      country: request.country || ''
    })
    if (userEmail) await sendApprovalEmail(userEmail, request.owner_first_name, request.razon_social)
  } else if (status === 'rejected') {
    if (userEmail) await sendRejectionEmail(userEmail, request.owner_first_name)
  }

  return request
}

export const getGlobalStatsService = async () => {
  return await getGlobalStats()
}
