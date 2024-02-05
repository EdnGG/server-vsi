const express = require('express')
const app = express()
const cors = require('cors')
// const userRoutes = require('./routes/users')
const chatRoutes = require('./routes/chatGpt')
// const connectDB = require('./config/db')

require('dotenv').config()
// connectDB()

app.use(cors())
app.use(express.json())

//3. Rutas
// app.use('/usuario', userRoutes)
// app.use('/chat', chatRoutes)
app.get('/', (req, res) => res.send('VSI CHATBOT API'))

// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log('El servidor está corriendo en 3000')
})
