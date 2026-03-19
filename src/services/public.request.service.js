import {
  upsertVerificationCode,
  findValidCode,
  deleteVerificationCode,
  findOrCreateUser
} from '../repositories/email.verification.repository.js'
import { createRequest } from '../repositories/companies.requests.repository.js'
import { sendVerificationEmail } from './email.service.js'
import { createCompany } from '../repositories/companies.repository.js'
import { updateUserRole } from '../repositories/user.repository.js'
import { getRucInfo } from './sunat.service.js'

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString()
export const sendPublicCodeService = async (email) => {
  if (!email) {
    const error = new Error('Email requerido')
    error.status = 400
    throw error
  }

  const code = generateCode()

  await upsertVerificationCode(email, code)

  try {
    await sendVerificationEmail(email, code, 'Solicitante')
  } catch (emailError) {
    console.error('Error enviando email:', emailError.message)
    throw emailError
  }

  return { message: 'Código enviado'/* code solo para pruebas */, code }
}

export const verifyPublicCodeService = async (email, code) => {
  const record = await findValidCode(email, code)
  if (!record) {
    const error = new Error('Código inválido o expirado')
    error.status = 400
    throw error
  }
  return { verified: true }
}

export const submitPublicRequestService = async (data) => {
  const { email, code, owner_first_name, owner_last_name, contact_phone, ruc, company_type, razon_social } = data
  const record = await findValidCode(email, code)
  if (!record) {
    const error = new Error('Código inválido o expirado')
    error.status = 400
    throw error
  }

  const rucInfo = await getRucInfo(ruc)
  console.log('rucInfo completo:', rucInfo)

  if (rucInfo.estado !== 'ACTIVO') {
    const error = new Error('RUC no activo en SUNAT')
    error.status = 400
    throw error
  }

  const user = await findOrCreateUser(email, owner_first_name, owner_last_name)

  // Crear solicitud como aprobada directamente
  await createRequest(user.id, {
    owner_first_name,
    owner_last_name,
    contact_phone,
    ruc,
    razon_social: rucInfo.razon_social,
    company_type,
    email_verified: true,
    verification_code: null,
    status: 'accepted'
  })

  // Aprobar automáticamente
  await updateUserRole(user.id, 'company')

  await createCompany(user.id, {
    company_name: rucInfo.razon_social || `Empresa ${ruc}`,
    description: '',
    industry: '',
    website_url: '',
    logo_url: null,
    company_size: null,
    city: '',
    country: ''
  })

  await deleteVerificationCode(email)

  return { message: 'Cuenta empresa creada exitosamente. Ya puedes iniciar sesión.' }
}
