require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3500

connectDB()
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/locations', require('./routes/locationRoutes'))
app.use('/terms', require('./routes/termRoutes'))
app.use('/orders', require('./routes/orderRoutes'))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})