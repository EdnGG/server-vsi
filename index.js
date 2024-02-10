const express = require('express')
const serverlees = require('serverless-http')
const cors = require('cors')
const chatRoutes = require('./routes/chatGpt')

const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

//3. Rutas
app.use('/chat', chatRoutes)
app.get('/', (req, res) => res.send('VSI CHATBOT API'))

// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log(`El servidor está corriendo en ${process.env.PORT}`)
})

// 5. Exportar a Netlify
module.exports.handler = serverless(app)