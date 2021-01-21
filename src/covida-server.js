const PORT = 8000

const path = require('path') 
const express = require('express') 
const morgan = require('morgan') 
const cookieParser = require('cookie-parser') 
const passport = require('passport') 
const expressSession = require('express-session')
const router = express.Router()

const igdbDb = require('./igdb-data')
const covidaDb = require('./covida-db-elastic')()
const covidaServices= require('./covida-services')(igdbDb,covidaDb)
const webApi  = require('./covida-web-site')(router, covidaServices)

const app = express()

app.use(expressSession({secret: "PI-2021i-L51D-G13"}))

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(webApi.serializeUser)
passport.deserializeUser(webApi.deserializeUser)

app.use(config.server["base_address"], router)
app.use('/', express.static(__dirname + '/public'))

app.listen(PORT, () => {
    console.log(`Covida app listening at http://localhost:${PORT}`)
})

//Remover ?
app.get('/home', homeNotAuthenticated)
app.get('/auth/home', homeAuthenticated)
function homeNotAuthenticated(req, rsp) {
    let user = req.user ? req.user.username : "unknown"
    rsp.end(`Everybody can reach  this endpoint. Hello ${user}`) 
  }
  
  function homeAuthenticated(req, rsp) {
    rsp.end(`You can only reach here if you are authenticated. Hello ${req.user.username}`)
  }
  
  