import {
  createRequest,
  getMyRequest,
  getAllRequests,
  updateRequestStatus,
  getGlobalStats
} from '../repositories/companies.requests.repository.js'
import { updateUserRole } from '../repositories/user.repository.js'
import { createCompany } from '../repositories/companies.repository.js'

export const createRequestService = async (userId, data) => {
  const existing = await getMyRequest(userId)
  if (existing && existing.status === 'pending') {
    throw new Error('ALREADY_REQUESTED')
  }
  return await createRequest(userId, data)
}

export const getMyRequestService = async (userId) => {
  return await getMyRequest(userId)
}

export const getAllRequestsService = async () => {
  return await getAllRequests()
}

export const resolveRequestService = async (requestId, status) => {
  const request = await updateRequestStatus(requestId, status)
  if (!request) throw new Error('REQUEST_NOT_FOUND')

  if (status === 'accepted') {
    await updateUserRole(request.user_id, 'company')
    await createCompany(request.user_id, {
      company_name: request.company_name,
      description: request.description,
      industry: request.industry,
      website_url: request.website_url,
      logo_url: null,
      company_size: null,
      city: request.city,
      country: request.country
    })
  }

  return request
}

export const getGlobalStatsService = async () => {
  return await getGlobalStats()
}
