import 'dotenv/config'
import express from 'express'
import candidatesRoutes from './routes/candidate.routes.js'
import userRoutes from './routes/user.routes.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/candidate', candidatesRoutes)
app.use('/user', userRoutes)

const PORT = process.env.PORT || 5432

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Working')
})
