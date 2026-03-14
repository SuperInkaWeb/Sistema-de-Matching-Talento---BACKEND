import {
  createVacancy,
  getAllActiveVacancies,
  getVacancyById,
  updateVacancy,
  deleteVacancy,
  getVacanciesByCompanyId,
  updateVacancyStatus
} from '../repositories/vacancies.repository.js'
import { getCompanyByUserId } from '../repositories/companies.repository.js'

export const createVacancyService = async (userId, vacancyData) => {
  const company = await getCompanyByUserId(userId)

  if (!company) {
    throw new Error('COMPANY_NOT_FOUND')
  }

  const vacancy = await createVacancy({
    company_id: company.id,
    ...vacancyData
  })

  return vacancy
}

export const getMyCompanyVacanciesService = async (userId) => {
  const company = await getCompanyByUserId(userId)

  if (!company) {
    throw new Error('COMPANY_NOT_FOUND')
  }

  const vacancies = await getVacanciesByCompanyId(company.id)

  return vacancies
}

export const getAllActiveVacanciesService = async () => {
  return await getAllActiveVacancies()
}

export const getVacancyByIdService = async (id) => {
  const vacancy = await getVacancyById(id)

  if (!vacancy) {
    throw new Error('VACANCY_NOT_FOUND')
  }

  return vacancy
}

export const updateVacancyService = async (id, data) => {
  const vacancy = await updateVacancy(id, data)

  if (!vacancy) {
    throw new Error('VACANCY_NOT_FOUND')
  }

  return vacancy
}

export const deleteVacancyService = async (vacancyId) => {
  const vacancy = await deleteVacancy(vacancyId)

  if (!vacancy) {
    throw new Error('VACANCY_NOT_FOUND')
  }

  return vacancy
}

export const updateVacancyStatusService = async (id, status) => {
  const vacancy = await updateVacancyStatus(id, status)
  if (!vacancy) throw new Error('VACANCY_NOT_FOUND')
  return vacancy
}
