import { sendContactEmail } from '../services/email.service.js'

export const sendContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    await sendContactEmail({ name, email, subject, message })

    res.json({ message: 'Mensaje enviado correctamente' })
  } catch (err) {
    console.error('contact error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
