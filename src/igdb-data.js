//acesso a api igdb 
//Use UrlLib Module to make http requests

const urllib = require("./node_modules/urllib")

const token = "Bearer t19htf57c5iskw9203r5jvm8njhw3j"
const client_ID = "gvziab9htl4uxx6lanjjf6bqbr16kt"
const baseUrl = "https://api.igdb.com/v4/games/"

getGameByName('DOOM', null)

module.exports = {
    getPopularGames,
    getGameByName
}

/*
urllib.request(baseUrl, {
  method: 'GET',
  headers: {
    'Client-ID': client_ID,
    'Authorization': `Bearer ${token}`
  },
  body: {
    fields *;
    where name = name
  }
})
*/

     
function getPopularGames(cb){
    //Obter a lista dos jogos mais populares
    //todo saber os ulr para fazer request da data necessária

   /*
        POST https://api.igdb.com/v4/games
        
        fields name,rating;
        sort rating desc;
        where rating != null;
    */
}
 
async function getGameByName(name, cb){
    //Pesquisar jogos pelo nome    
    //let url =`${baseurl}search?clientId=${client_Id}&authorization=${token}&query=${name}` ????
    //todo saber os ulr para fazer request da data necessária

    /*
    POST https://api.igdb.com/v4/games
        
        fields *;
        where name = name
    */

    //Also can use: search name;
    //search returns the exact game name and similar ones

    let get = await urllib.request(baseUrl, {
        method: 'GET',
        headers: {
            'Client-ID': client_ID,
            'Authorization': `Bearer ${token}`
        }
    })

    console.log(get)
}

