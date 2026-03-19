import { supabase } from '../database/connectionSupabase.js'
import { findUserByAuth0Id } from '../repositories/user.repository.js'
import { findCandidateProfile, updateResumeUrl } from '../repositories/candidates.repository.js'
import {
  deactivatePreviousResumes,
  createCandidateFile,
  getCandidateCV
} from '../repositories/files.repository.js'

export const uploadResumeService = async (auth0Id, file) => {
  const user = await findUserByAuth0Id(auth0Id)
  if (!user) {
    const error = new Error('Usuario no encontrado')
    error.status = 404
    throw error
  }

  if (user.role !== 'candidate') {
    const error = new Error('Solo candidatos pueden subir CV')
    error.status = 403
    throw error
  }

  const profile = await findCandidateProfile(user.id)
  if (!profile) {
    const error = new Error('El usuario no tiene perfil de candidato')
    error.status = 400
    throw error
  }

  const filePath = `resumes/${profile.id}-${Date.now()}.pdf`

  await deactivatePreviousResumes(profile.id)

  const { error: uploadError } = await supabase.storage
    .from('candidates_files')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    })

  if (uploadError) {
    const err = new Error(uploadError.message)
    err.status = 500
    throw err
  }

  await updateResumeUrl(user.id, filePath)

  return await createCandidateFile(profile.id, {
    file_name: `${profile.id}-${Date.now()}.pdf`,
    file_url: filePath,
    file_type: 'resume'
  })
}

export const downloadCVService = async (candidateProfileId) => {
  const file = await getCandidateCV(candidateProfileId)

  if (!file) {
    throw new Error('CV_NOT_FOUND')
  }

  // file_url ya es el path relativo dentro del bucket
  const filePath = file.file_url.includes('/candidates_files/')
    ? file.file_url.split('/candidates_files/')[1]
    : file.file_url

  const { data, error } = await supabase.storage
    .from('candidates_files')
    .createSignedUrl(filePath, 60)

  if (error) {
    throw new Error(error.message)
  }

  return {
    signedUrl: data.signedUrl,
    fileName: file.file_name || 'cv.pdf'
  }
}

export const getMyCVService = async (auth0Id) => {
  const user = await findUserByAuth0Id(auth0Id)
  if (!user) throw new Error('Usuario no encontrado')

  const profile = await findCandidateProfile(user.id)
  if (!profile) throw new Error('Perfil no encontrado')

  const file = await getCandidateCV(profile.id)
  if (!file) throw new Error('CV_NOT_FOUND')

  const filePath = file.file_url.includes('/candidates_files/')
    ? file.file_url.split('/candidates_files/')[1]
    : file.file_url

  const { data, error } = await supabase.storage
    .from('candidates_files')
    .createSignedUrl(filePath, 60)

  if (error) throw new Error(error.message)

  return { signedUrl: data.signedUrl, fileName: file.file_name || 'cv.pdf' }
}
