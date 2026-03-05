import 'dotenv/config'
import express from 'express'
import candidatesRoutes from './routes/candidate.routes.js'
import userRoutes from './routes/user.routes.js'
import fileRoutes from './routes/file.routes.js'
import companyRoutes from './routes/company.routes.js'
import vacancyRoutes from './routes/vacancy.routes.js'
import applyRoutes from './routes/apply.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/candidate', candidatesRoutes)
app.use('/user', userRoutes)
app.use('/file', fileRoutes)
app.use('/company', companyRoutes)
app.use('/vacancy', vacancyRoutes)
app.use('/apply', applyRoutes)

const PORT = process.env.PORT || 5432

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
