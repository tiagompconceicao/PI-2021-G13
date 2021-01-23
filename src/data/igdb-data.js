
const { Console } = require("console")
const urllib = require("urllib")

const token = "56d5ub03mbfnjy39hcsm66d2k2s4na"
const client_ID = "gvziab9htl4uxx6lanjjf6bqbr16kt"
const baseUrl = "https://api.igdb.com/v4/games/"

module.exports = {
    getGameByName,
    getGameById
}
 
function getGameByName(gameName){
  //Pesquisar jogos pelo nome    

 const settings = {
    method: "POST",
    headers: {
      'Client-ID': client_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type': "text/plain",
    },
    data: `fields name,total_rating,summary;search "${gameName}";`
  }

  return urllib.request(baseUrl,settings).then(result => {
  //result: {data: buffer, res: response object}
    return JSON.parse(result.data)
  }).catch( err => {
    throw err
  })
}

function getGameById(gameId){
  //Pesquisar jogos pelo nome    

 const settings = {
    method: "POST",
    headers: {
      'Client-ID': client_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type': "text/plain",
    },
    data: `fields name,total_rating,summary;where id = ${gameId};`
  }
    
  return urllib.request(baseUrl,settings).then(result => {
    return JSON.parse(result.data)[0]
  }).catch(err => {
    throw err
  })
  
}