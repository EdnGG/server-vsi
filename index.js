const express = require('express')

const app = express()
const cors = require('cors')
const chatRoutes = require('./routes/chatGpt')
const vsiBot = require('./routes/assistant')

require('dotenv').config()

app.use(cors())
app.use(express.json())

//3. Rutas
app.get('/', (req, res) => res.send('VSI CHATBOT API'))
app.use('/assistant', chatRoutes)
app.use('/assistant', vsiBot)

// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log(`El servidor está corriendo en ${process.env.PORT}`)
})
