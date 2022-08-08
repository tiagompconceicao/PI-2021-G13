const PORT = 8000

const path = require('path') 
const express = require('express') 
const morgan = require('morgan') 
const cookieParser = require('cookie-parser') 
const passport = require('passport') 
const expressSession = require('express-session')

const igdbDb = require('./data/igdb-data')
const covidaDb = require('./data/covida-db-elastic')()
const covidaServices= require('./application-logic/covida-services')(igdbDb,covidaDb)
const covidaApiRouter = require('./web-interface/covida-web-api')(covidaServices)
const covidaSiteRouter  = require('./web-interface/covida-web-site')(covidaServices)
const covidaUsersRouter = require('./web-interface/users-web-site')(covidaServices)

const app = express()

app.use(expressSession({secret: "PI-2021i-L51D-G13"}))

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'web-interface', 'public')))


app.set('views', path.join(__dirname, 'web-interface', 'views'))
app.set('view engine', 'hbs')


app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

app.get('/api', apiCheck)
app.use('/covida/api', covidaApiRouter)
app.use('/covida/site', verifyAuthenticated, covidaSiteRouter)
app.use('/covida/users', covidaUsersRouter)
app.get('/covida/home', home)


app.listen(PORT, () => {
    console.log(`Covida app listening at http://localhost:${PORT}`)
})

function serializeUser(user, done) {
  console.log("serializeUserCalled")
  console.log(user)
  done(null, {username: user.username})
}

function deserializeUser(user, done) {
  console.log("deserializeUserCalled")
  console.log(user)
  done(null, user)
}


function verifyAuthenticated(req, rsp, next) {
  if(req.user) {
    return next()
  }
  rsp.redirect(401, '/covida/users/login')
}

function apiCheck(req, rsp) {
  rsp.status(200)
     .json({
     "name": "Covida api",
     "version": "1.0.0",
     "description": "Covida Groups API running"
     })
}

function home(req, rsp) {
  rsp.redirect(302, '/covida/users/login')
}

  