import {
  getMeService,
  updateProfileService
} from '../services/candidate.service.js'
import { awardPoints, isProfileComplete } from '../services/points.service.js'

export const getMe = async (req, res) => {
  try {
    const auth0Id = req.user.sub
    const data = await getMeService(auth0Id)

    res.json(data)
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    console.error('ERROR REAL:', error)
    res.status(500).json({
      error: error.message
    })
  }
}

export const updateMyProfile = async (req, res) => {
  try {
    const auth0Id = req.dbUser.auth0_id
    const profile = await updateProfileService(
      auth0Id,
      req.body
    )
    if (isProfileComplete(profile)) {
      await awardPoints(req.dbUser.id, 'COMPLETE_PROFILE')
    }
    res.json({
      message: 'Perfil actualizado correctamente',
      profile
    })
  } catch (error) {
    console.error('updateMyProfile error:', error.message) // ← agrega
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.status(500).json({ error: 'Error interno' })
  }
}
