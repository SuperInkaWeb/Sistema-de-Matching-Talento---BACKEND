import {
  getMeService,
  upsertCandidateProfileService
} from '../services/candidate.service.js'

export const getMe = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub

    const data = await getMeService(auth0Id)

    res.json(data)
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.status(500).json({ error: 'Error interno' })
  }
}

export const updateMyProfile = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub

    const profile = await upsertCandidateProfileService(
      auth0Id,
      req.body
    )

    res.json({
      message: 'Perfil actualizado correctamente',
      profile
    })
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    res.status(500).json({ error: 'Error interno' })
  }
}
