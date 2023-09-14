require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cookieParser = require("cookie-parser")

const app = express()
const cors = require('cors')
const port = process.env.PORT
const router = require('./src/router/index')


app.use(cors())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser());


app.get('/',(req,res) => {
  res.status(200).send('Hello Ini Api CvPalangkaJaya')
})


app.use(`${process.env.BASE_URL}`, router)

app.all('*',(req,res) => {
    res.status(404).json({message :"Sorry, page not found"});
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})