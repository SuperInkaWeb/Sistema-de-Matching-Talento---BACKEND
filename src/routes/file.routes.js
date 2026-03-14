import express from 'express'
import {
  uploadResumeController,
  downloadCV,
  getMyCVController
} from '../controllers/file.controller.js'
import {
  checkJwt,
  syncUser
} from '../middleware/auth0.middleware.js'
import { checkRole } from '../middleware/role.middleware.js'
import { upload } from '../middleware/upload.middleware.js'

const router = express.Router()

router.post(
  '/candidate/upload-cv',
  checkJwt,
  syncUser,
  upload.single('cv'),
  uploadResumeController
)

router.get(
  '/candidate/my-cv',
  checkJwt,
  syncUser,
  getMyCVController
)

router.get(
  '/download-cv/:candidateId',
  checkJwt,
  syncUser,
  checkRole(['company', 'admin']),
  downloadCV
)

export default router
