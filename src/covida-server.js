/* Ponto de entrada da aplicação ao servidor  é aqui que é craido o acesso 
ao  http://localhost:8000/COVIDA
aqui é o usado express*/

const PORT = 8000

const express = require('express')
const webapi  = require('./covida-web-api')

const app = express()

app.use(express.json())

/*app.get('/covida')
app.get()
app.get()
app.delete()
app.put()
app.post()*/

app.get('/covida', webapi.getPopularGames)
app.get(`/covida/game/:name`, webapi.getGameByName)
app.post(`/covida/groups`, webapi.createGroup)
app.put(`/covida/groups/:groupName`, webapi.editGroup)
app.get(`/covida/groups`, webapi.getAllGroups)
app.get(`/covida/groups/:groupName`, webapi.getGroupDetails)
app.put(`/covida/groups/:groupName/game/:name`, webapi.addGameToGroup)
app.delete(`/covida/groups/:groupName/game/:name`, webapi.removeGameFromGroup)
app.get(`/covida/groups/:groupName/:min/:max`, webapi.getGamesFromGroupWithinRange)

app.listen(PORT, () => {
    console.log(`Tasks app listening at http://localhost:${PORT}`)
})