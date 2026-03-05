import {
  createCompany,
  getCompanyByUserId,
  updateCompany,
  deleteCompany
} from '../repositories/companies.repository.js'
import { updateUserRole } from '../repositories/user.repository.js'

export const createCompanyService = async (data, userId) => {
  const existing = await getCompanyByUserId(userId)

  if (existing) {
    throw new Error('COMPANY_ALREADY_EXISTS')
  }

  const company = await createCompany({
    ...data,
    user_id: userId
  })

  await updateUserRole(userId, 'company')

  return company
}

export const getMyCompanyService = async (userId) => {
  const company = await getCompanyByUserId(userId)

  if (!company) {
    throw new Error('COMPANY_NOT_FOUND')
  }

  return company
}

export const updateCompanyService = async (userId, data) => {
  const company = await updateCompany(userId, data)

  if (!company) {
    throw new Error('COMPANY_NOT_FOUND')
  }

  return company
}

export const deleteCompanyService = async (userId) => {
  return await deleteCompany(userId)
}
