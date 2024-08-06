const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


let url = ['http://localhost:4200', 'http://localhost:8080', 'http://localhost:9090']
app.use(cors({origin: url}))
app.use(bodyParser.json());

require('./routers/sendEmail')(app)







server.listen( 7070, console.log('server started'))