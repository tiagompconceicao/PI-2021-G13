/* Ponto de entrada da aplicação ao servidor  é aqui que é craido o acesso 
ao  http://localhost:8000/COVIDA
aqui é o usado express*/

const PORT = 8000

const path = require('path') 
const express = require('express') 
const morgan = require('morgan') 
const cookieParser = require('cookie-parser') 
const passport = require('passport') 
const expressSession = require('express-session');

const igdbDb = require('./igdb-data')
const covidaDb = require('./covida-db-elastic')()
const covidaServices= require('./covida-services')(igdbDb,covidaDb)
const webapi  = require('./covida-web-api')(covidaServices)

const app = express()

app.use(expressSession({secret: "iselpi1"}))

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);


app.use('/auth', verifyAuthenticated)

app.get('/home', homeNotAuthenticated)
app.get('/auth/home', homeAuthenticated)

app.post('/login', validateLogin)
app.post('/logout', logout)


app.get('/covida',apiCheck)
app.get(`/covida/games/:gameName`, webapi.getGameByName)
app.post(`/covida/groups`, webapi.createGroup)
app.put(`/covida/groups/:groupId`, webapi.editGroup)
app.delete(`/covida/groups/:groupId`, webapi.deleteGroup)
app.get(`/covida/groups`, webapi.getAllGroups)
app.get(`/covida/groups/:groupId`, webapi.getGroupDetails)
app.put(`/covida/groups/:groupId/games/:gameId`, webapi.addGameToGroup)
app.delete(`/covida/groups/:groupId/games/:gameId`, webapi.removeGameFromGroup)
app.get(`/covida/groups/:groupId/:min/:max`, webapi.getGamesFromGroupWithinRange)    

app.listen(PORT, () => {
    console.log(`Covida app listening at http://localhost:${PORT}`)
})

function apiCheck(req, rsp) {
    rsp
      .status(200)
      .json({
      "name": "groups api",
      "version": "1.0.0",
      "description": "PI Groups API running"
      })
}

/*
function homeNotAuthenticated(req, rsp) {
    let user = req.user ? req.user.username : "unknown"
    rsp.end(`Everybody can reach  this endpoint. Hello ${user}`) 
  }
  
  function homeAuthenticated(req, rsp) {
    rsp.end(`You can only reach here if you are authenticated. Hello ${req.user.username}`)
  }
  
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
  
  
  function validateLogin(req, rsp) {
    if(validateUser(req.body.username, req.body.password)) {
      req.login({
        username: req.body.username,
        dummy: "dummy property on user"
      }, (err) => rsp.redirect('/home/authenticated'))
    }
  
  
  
    function validateUser(username, password) { return true }
  }
  
  
  function verifyAuthenticated(req, rsp, next) {
    if(req.user) {
      return next()
    }
    rsp.status(401).send("not authorized")
  }
  function logout(req, rsp) {
    req.logout()
    rsp.redirect('/home')
  }*/