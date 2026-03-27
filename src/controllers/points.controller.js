import {
  getMyPointsService,
  getLeaderboardService
} from '../services/points.service.js'

export const getMyPoints = async (req, res) => {
  try {
    const result = await getMyPointsService(req.dbUser.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    const result = await getLeaderboardService()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
