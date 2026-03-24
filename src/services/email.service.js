import SibApiV3Sdk from 'sib-api-v3-sdk'

const defaultClient = SibApiV3Sdk.ApiClient.instance
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY

const client = new SibApiV3Sdk.TransactionalEmailsApi()
const FROM = { email: process.env.EMAIL, name: 'Humantyx' }

export const sendVerificationEmail = async (to, code, ownerName) => {
  const email = new SibApiV3Sdk.SendSmtpEmail()
  email.to = [{ email: to }]
  email.sender = FROM
  email.subject = 'Código de verificación - Solicitud de cuenta empresa'
  email.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <img src="${process.env.FRONTEND_URL}/logo-email.png" 
     alt="Humantyx Jobs" 
     style="height: 48px; width: auto; margin-bottom: 24px; display: block;" />
      <p style="color: #666; margin-bottom: 32px;">Plataforma de matching de talento</p>
      <h2 style="color: #0a0a0f;">Hola, ${ownerName} 👋</h2>
      <p style="color: #444; line-height: 1.6;">
        Recibimos tu solicitud para crear una cuenta empresa.
        Usa el siguiente código para verificar tu correo:
      </p>
      <div style="background: #f4f1eb; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <span style="font-size: 2.5rem; font-weight: 800; letter-spacing: 8px; color: #3DBFB8;">
          ${code}
        </span>
      </div>
      <p style="color: #999; font-size: 0.85rem;">
        Este código expira en 15 minutos. Si no solicitaste esto, ignora este correo.
      </p>
    </div>
  `
  return await client.sendTransacEmail(email)
}

export const sendApprovalEmail = async (to, ownerName, companyName) => {
  const email = new SibApiV3Sdk.SendSmtpEmail()
  email.to = [{ email: to }]
  email.sender = FROM
  email.subject = '¡Tu cuenta empresa fue aprobada! - Humantyx'
  email.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <img src="${process.env.FRONTEND_URL}/logo-email.png" 
     alt="Humantyx Jobs" 
     style="height: 48px; width: auto; margin-bottom: 24px; display: block;" />
      <h2 style="color: #3DBFB8;">¡Felicitaciones, ${ownerName}! 🎉</h2>
      <p style="color: #444; line-height: 1.6;">
        Tu solicitud para <strong>${companyName}</strong> ha sido aprobada.
        Ya puedes iniciar sesión y acceder al dashboard de empresa.
      </p>
      <a href="${process.env.FRONTEND_URL}/login"
         style="display: inline-block; background: #0a0a0f; color: #fff;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 600; margin-top: 16px;">
        Ir a Humantyx
      </a>
    </div>
  `
  return await client.sendTransacEmail(email)
}

export const sendRejectionEmail = async (to, ownerName) => {
  const email = new SibApiV3Sdk.SendSmtpEmail()
  email.to = [{ email: to }]
  email.sender = FROM
  email.subject = 'Actualización de tu solicitud - Humantyx'
  email.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <img src="${process.env.FRONTEND_URL}/logo-email.png" 
     alt="Humantyx Jobs" 
     style="height: 48px; width: auto; margin-bottom: 24px; display: block;" />
      <h2 style="color: #0a0a0f;">Hola, ${ownerName}</h2>
      <p style="color: #444; line-height: 1.6;">
        Lamentablemente tu solicitud de cuenta empresa no pudo ser aprobada en este momento.
        Si crees que hay un error, contáctanos.
      </p>
    </div>
  `
  return await client.sendTransacEmail(email)
}

export const sendInvitationEmail = async (to, token, role) => {
  const roleLabel = role === 'company' ? 'empresa' : 'candidato'
  const link = `${process.env.FRONTEND_URL}/registro?token=${token}`
  const email = new SibApiV3Sdk.SendSmtpEmail()
  email.to = [{ email: to }]
  email.sender = FROM
  email.subject = `Te invitaron a unirte a Humantyx como ${roleLabel}`
  email.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <img src="${process.env.FRONTEND_URL}/logo-email.png" 
     alt="Humantyx Jobs" 
     style="height: 48px; width: auto; margin-bottom: 24px; display: block;" />
      <h2 style="color: #0a0a0f;">¡Tienes una invitación! 🎉</h2>
      <p style="color: #444; line-height: 1.6;">
        Fuiste invitado a unirte a Humantyx como <strong>${roleLabel}</strong>.
        Haz clic en el botón para completar tu registro.
      </p>
      <a href="${link}"
         style="display: inline-block; background: #3DBFB8; color: #fff;
                padding: 14px 28px; border-radius: 8px; text-decoration: none;
                font-weight: 700; margin-top: 20px; font-size: 1rem;">
        Aceptar invitación
      </a>
      <p style="color: #999; font-size: 0.85rem; margin-top: 24px;">
        Este link expira en 7 días. Si no esperabas esta invitación, ignora este correo.
      </p>
    </div>
  `
  return await client.sendTransacEmail(email)
}

export const sendContactEmail = async ({ name, email, subject, message }) => {
  const mail = new SibApiV3Sdk.SendSmtpEmail()
  mail.to = [{ email: process.env.ADMIN_EMAIL }]
  mail.sender = FROM
  mail.replyTo = { email, name }
  mail.subject = `[Contacto Humantyx] ${subject}`
  mail.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <img src="${process.env.FRONTEND_URL}/logo-email.png" alt="Humantyx Jobs"
           style="height: 48px; width: auto; margin-bottom: 24px; display: block;" />
      <h2 style="color: #0a0a0f;">Nuevo mensaje de contacto</h2>
      <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; font-weight:700; color:#666;">Nombre:</td><td style="padding: 8px;">${name}</td></tr>
        <tr><td style="padding: 8px; font-weight:700; color:#666;">Email:</td><td style="padding: 8px;">${email}</td></tr>
        <tr><td style="padding: 8px; font-weight:700; color:#666;">Asunto:</td><td style="padding: 8px;">${subject}</td></tr>
      </table>
      <div style="background:#f4f1eb; border-radius:12px; padding:20px;">
        <p style="color:#444; line-height:1.7; margin:0;">${message.replace(/\n/g, '<br/>')}</p>
      </div>
    </div>
  `
  await client.sendTransacEmail(mail)
}
