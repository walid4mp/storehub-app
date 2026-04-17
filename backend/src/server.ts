import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()
const port = Number(process.env.PORT || 8080)

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'storehub-backend' })
})

app.get('/api/v1/meta', (_req, res) => {
  res.json({
    name: 'StoreHub API',
    modules: ['auth', 'stores', 'products', 'orders', 'chat', 'referrals', 'subscriptions', 'templates'],
  })
})

app.listen(port, () => {
  console.log(`StoreHub API listening on port ${port}`)
})
