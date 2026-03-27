import {
  createCompanyService,
  getMyCompanyService,
  updateCompanyService,
  deleteCompanyService
} from '../services/company.service.js'

export const createCompany = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const company = await createCompanyService(req.body, userId)

    res.status(201).json(company)
  } catch (error) {
    if (error.message === 'COMPANY_ALREADY_EXISTS') {
      return res.status(400).json({
        error: 'El usuario ya tiene una compañía registrada'
      })
    }

    res.status(500).json({ error: error.message })
  }
}

export const getMyCompany = async (req, res) => {
  try {
    const userId = req.dbUser.id
    const company = await getMyCompanyService(userId)

    res.json(company)
  } catch (error) {
    res.status(404).json({ error: 'Compañía no encontrada' })
  }
}

export const updateCompany = async (req, res) => {
  try {
    const company = await updateCompanyService(req.dbUser.id, req.body)
    res.json(company)
  } catch (error) {
    res.status(404).json({ error: 'Compañía no encontrada' })
  }
}

export const deleteCompany = async (req, res) => {
  await deleteCompanyService(req.dbUser.id)
  res.status(204).send()
}
