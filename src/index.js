import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import candidatesRoutes from './routes/candidate.routes.js'
import userRoutes from './routes/user.routes.js'
import fileRoutes from './routes/file.routes.js'
import companyRoutes from './routes/company.routes.js'
import vacancyRoutes from './routes/vacancy.routes.js'
import applyRoutes from './routes/apply.routes.js'
import aiRoutes from './routes/groq.routes.js'
import adminRoutes from './routes/admin.routes.js'
import companyRequestRoutes from './routes/company.request.routes.js'
import publicRequestRoutes from './routes/public.request.routes.js'
import invitationRoutes from './routes/invitation.routes.js'
import educationRoutes from './routes/education.routes.js'
import contactRoutes from './routes/contact.routes.js'

const app = express()

app.use(cors({
  origin: '*'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/candidate', candidatesRoutes)
app.use('/user', userRoutes)
app.use('/file', fileRoutes)
app.use('/company', companyRoutes)
app.use('/vacancy', vacancyRoutes)
app.use('/apply', applyRoutes)
app.use('/ai', aiRoutes)
app.use('/admin', adminRoutes)
app.use('/company-request', companyRequestRoutes)
app.use('/public/company-request', publicRequestRoutes)
app.use('/invitation', invitationRoutes)
app.use('/education', educationRoutes)
app.use('/contact', contactRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
