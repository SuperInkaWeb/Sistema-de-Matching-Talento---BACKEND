import {
  uploadResumeService,
  downloadCVService,
  getMyCVService
} from '../services/file.service.js'
import { awardPoints } from '../services/points.service.js'

export const uploadResumeController = async (req, res) => {
  try {
    const auth0Id = req.dbUser.auth0_id

    if (!req.file) {
      return res.status(400).json({ message: 'Archivo requerido' })
    }

    const result = await uploadResumeService(auth0Id, req.file)
    await awardPoints(req.dbUser.id, 'UPLOAD_CV')

    res.status(201).json(result)
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error interno'
    })
  }
}

export const downloadCV = async (req, res) => {
  try {
    const { candidateId } = req.params

    const file = await downloadCVService(candidateId)

    return res.redirect(file.signedUrl)
  } catch (error) {
    if (error.message === 'CV_NOT_FOUND') {
      return res.status(404).json({
        error: 'CV no encontrado'
      })
    }

    console.error(error)

    res.status(500).json({
      error: 'Error al descargar CV'
    })
  }
}

export const getMyCVController = async (req, res) => {
  try {
    const auth0Id = req.user.sub
    const result = await getMyCVService(auth0Id)
    res.json(result)
  } catch (error) {
    if (error.message === 'CV_NOT_FOUND') {
      return res.status(404).json({ error: 'No tienes CV subido' })
    }
    res.status(500).json({ error: error.message })
  }
}
