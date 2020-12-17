/* Ponto de entrada da aplicação ao servidor  é aqui que é craido o acesso 
ao  http://localhost:8000/COVIDA
aqui é o usado express*/

const PORT = 8000

const express = require('express')

const db = require('./groups')
const igdbDb = require('./igdb-data')
const covidaDb = require('./covida-db')(db)
const covidaServices= require('./covida-services')(igdbDb,covidaDb)
const webapi  = require('./covida-web-api')(covidaServices)

const app = express()

app.use(express.json())

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