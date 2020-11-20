/* Ponto de entrada da aplicação ao servidor  é aqui que é craido o acesso 
ao  http://localhost:8000/COVIDA
aqui é o usado express*/

const PORT = 8000

const express = require('')
const task  = require('./covida-web-api')

const app = express()

app.use(express.json())

app.get()
app.get()
app.get()
app.delete()
app.put()
app.post()

app.listen(PORT, () => {
    console.log(`Tasks app listening at http://localhost:${PORT}`)
})
