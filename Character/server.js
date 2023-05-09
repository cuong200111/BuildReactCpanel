const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const fs = require('fs')
const axios =require('axios')
const Get = require('./controller/get/index')
const Post = require('./controller/post/index')
const Delete = require('./controller/delete/index')
const cookies = require('cookie-parser')
const baseCss = './css/base.css'
const db = require('./model/db')
const http = require('http');
const compress = require('compression')
require('dotenv').config()

const app = express()
app.use(compress())

app.use(cookies())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use((req, res, next) => {
    res.locals.baseCss = baseCss
    res.locals.logo = '/img/logo.png'

    res.locals.thumHome = '/img/Thumb.jpg'
    next()
})

app.use((req, res, next) => {
    res.locals.cook = req.cookies.online
    next()
})
app.use((req, res, next) => {
    db.query('SELECT * FROM theloai', (err, data2) => {
        res.locals.theloai = data2
        next()
    })
})
app.use((req, res, next) => {
    db.query('SELECT * FROM tacgia', (err, data3) => {
        res.locals.tacgia = data3
        next()
    })
})
app.use((req, res, next) => {
    db.query('SELECT * FROM anime', (err, data) => {
        res.locals.data = data
        next()
    })
})
app.use('/imgs', express.static('./all'))
app.use('/', Get)
app.use('/', Post)
app.use('/', Delete)


const server = http.createServer(app)
server.listen(3000 || process.env.PORT)