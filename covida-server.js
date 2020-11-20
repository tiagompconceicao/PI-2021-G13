/* Ponto de entrada da aplicação ao servidor  é aqui que é craido o acesso 
ao  http://localhost:8000/COVIDA
aqui é o usado express*/

const PORT = 8000

const express = require('express')
const task  = require('./covida-web-api')

const app = express()

app.use(express.json())

/*app.get('/covida')
app.get()
app.get()
app.delete()
app.put()
app.post()*/

app.get('/covida', covida-web-api.getPopularGames)
app.get(`/covida/game/:name`, covida-web-api.getGameByName)
app.post(`/covida/groups`, covida-web-api.createGroup)
app.put(`/covida/groups/:groupName`, covida-web-api.editGroup)
app.get(`/covida/groups`, covida-web-api.getAllGroups)
app.get(`/covida/groups/:groupName`, covida-web-api.getGroupDetails)
app.put(`/covida/groups/:groupName/game/:name`, covida-web-api.addGameToGroup)
app.delete(`/covida/groups/:groupName/game/:name`, covida-web-api.removeGameFromGroup)
app.get(`/covida/groups/:groupName/:min/:max`, covida-web-api.getGamesFromGroupWithinRange)

app.listen(PORT, () => {
    console.log(`Tasks app listening at http://localhost:${PORT}`)
})
