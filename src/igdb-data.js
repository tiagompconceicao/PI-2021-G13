//acesso a api igdb 
//Use UrlLib Module to make http requests

//const urllib = require("./node_modules/urllib")
const urllib = require("urllib")

const token = "t19htf57c5iskw9203r5jvm8njhw3j"
const client_ID = "gvziab9htl4uxx6lanjjf6bqbr16kt"
const baseUrl = "https://api.igdb.com/v4/games/"

//getGameByName('Fifa 14', null)
//getPopularGames(null)

module.exports = {
    getPopularGames,
    getGameByName
}
     
function getPopularGames(cb){
    //Obter a lista dos jogos mais populares
    //todo saber os ulr para fazer request da data necessária

   let get = urllib.request(baseUrl, {
    method: 'POST',
    headers: {
        'Client-ID': client_ID,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain'
    },
  data: "fields *;sort rating desc;where rating!= null;"

})

//cb(get)

//Remover .then(), penso que não podemos usar esta função Promise
get.then(result => {
    console.log(result.status) // "Some User token"
    const body = JSON.parse(result.data)
    console.log(body)
 })
}
 
async function getGameByName(gameName, cb){
    //Pesquisar jogos pelo nome    
    //todo saber os ulr para fazer request da data necessária
    
    let get = urllib.request(baseUrl, {
        method: 'POST',
        headers: {
            'Client-ID': client_ID,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain'
        },
       data: `fields name, rating; search "${gameName}"; limit 1;`
    })

    //Remover .then(), penso que não podemos usar esta função Promise
    get.then(result => {
        console.log(result.status) // "Some User token"
        const body = JSON.parse(result.data)
        console.log(body)
     })
    

    //or

    /*let get = urllib.request(baseUrl, {
        method: 'GET',
        headers: {
            'Client-ID': client_ID,
            'Authorization': `Bearer ${token}`
        },
       data:{
        fields: 'name,rating',
        search: gameName,
        limit: 1
      }
    
    })

    //cb(get)

    //Remover .then(), penso que não podemos usar esta função Promise
    get.then(result => {
        console.log(result.status) // "Some User token"
        const body = JSON.parse(result.data)
        console.log(body)
     })*/

}

