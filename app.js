const express = require('express');
const app = express()
const port = 3000
const router = require('./routes/index.js')
const session = require('express-session')

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false }))

app.use(session({
secret: 'secret',
  resave: false,
  saveInitialized: false,
  cookie: {
    secure: false,
    sameSite: true 
  }
}))

app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})