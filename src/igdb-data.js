
const urllib = require("urllib")

const token = "t19htf57c5iskw9203r5jvm8njhw3j"
const client_ID = "gvziab9htl4uxx6lanjjf6bqbr16kt"
const baseUrl = "https://api.igdb.com/v4/games/"

module.exports = {
    getGameByName
}
  
/*
function getPopularGames(cb){
    //Obter a lista dos jogos mais populares
    const settings = {
    method: 'POST',
    headers: {
        'Client-ID': client_ID,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain'
    },
  data: "fields *;sort rating desc;where rating!= null;"
}
   const get = urllib.request(baseUrl,settings,(err, data, res) => {
    if(err) return cb("err")
    const obj = JSON.parse(data)
    cb(obj)
})
}
*/
 
 function getGameByName(gameName, cb){
    //Pesquisar jogos pelo nome    

   const settings = {
        method: "POST",
        headers: {
          'Client-ID': client_ID,
          'Authorization': `Bearer ${token}`,
          'Content-Type': "text/plain",
        },
        data: `fields name,total_rating;search "${gameName}";`,
      }
    
    const get = urllib.request(baseUrl,settings,(err, data, res) => {
        if(err) return cb(err)
        const obj = JSON.parse(data)
        cb(null,obj)
    })
}