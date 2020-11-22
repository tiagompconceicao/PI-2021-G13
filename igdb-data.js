//acesso a api igdb 

const token = "Bearer ufcyc2wp04hs7z23ojphz0xujefe13"
const client_ID = "gvzqbx37hialxnepf7muzm1vx5bqqr"
const baseUrl = "https://api.igdb.com/v4/games"

module.exports = {
    getPopularGames: function (cb){
        //Obter a lista dos jogos mais populares
        
        //todo saber os ulr para fazer request da data necessária
    },
    getGameByName: function (name, cb){
        //Pesquisar jogos pelo nome
        
        //let url =`${baseurl}search?clientId=${client_Id}&authorization=${token}&query=${name}` ????
        //todo saber os ulr para fazer request da data necessária
    }
}
