import {
  getEducationService,
  addEducationService,
  updateEducationService,
  deleteEducationService
} from '../services/education.service.js'

export const getEducation = async (req, res) => {
  try {
    const result = await getEducationService(req.dbUser.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const addEducation = async (req, res) => {
  try {
    const result = await addEducationService(req.dbUser.id, req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateEducation = async (req, res) => {
  try {
    const result = await updateEducationService(req.dbUser.id, req.params.id, req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteEducation = async (req, res) => {
  try {
    await deleteEducationService(req.dbUser.id, req.params.id)
    res.json({ message: 'Eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
