const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const path = require('path')

const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')
const app = express()

//require('dotenv').config()

mongoose.connect("mongodb+srv://dmitriy:" + process.env.MONGO_PASSWORD + "@cluster0.1u5fa.mongodb.net/meanapp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to database')
}).catch(() => {
    console.log('Connection failed')
})

app.use(bodyParser.json())
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/", express.static(path.join(__dirname, "angularapp")))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")

    next()
})

app.use("/api/posts", postsRoutes)
app.use("/api/user", userRoutes)
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "angularapp", "index.html"))
})
module.exports = app;