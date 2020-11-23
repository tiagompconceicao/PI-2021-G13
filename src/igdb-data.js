//acesso a api igdb 
//Use UrlLib Module to make http requests

const urllib = require("./urllib")

const token = "Bearer ufcyc2wp04hs7z23ojphz0xujefe13"
const client_ID = "gvzqbx37hialxnepf7muzm1vx5bqqr"
const baseUrl = "https://api.igdb.com/v4/games"

module.exports = {
    getPopularGames,
    getGameByName
}

/*
urllib.request(baseUrl, {
  method: 'GET',
  headers: {
    'Client-ID': client_ID,
    'Authorization': `Bearer ${toke}`
  },
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
 
function getGameByName(name, cb){
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
}

