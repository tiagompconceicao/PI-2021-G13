/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

const urllib = require("urllib")
const baseUrl = "https://localhost:9200/groups/"
let maxID = 0

const Uri = {
    CREATE_GROUP: `${baseUrl}group/`,
    GET_GROUP: `${baseUrl}group/`,
    GET_ALL_GROUPS: `${baseUrl}_search`
}

module.exports = function(groups) {
    if(!groups){
        groups = require('./initialGroups')

    }

    return {
        createGroup,
        editGroup,
        deleteGroup,
        getAllGroups,
        getGroupDetails,
        verifyIfGameExistsInGroup,
        addGameToGroup,
        removeGameFromGroup,
        getGamesFromGroupWithinRange
    }
     
    async function createGroup(groupName, groupDescription){
        //Criar grupo atribuindo-lhe um nome e descrição
 
        let group = {
            id: maxId++,
            name: groupName,
            description: groupDescription, 
            games: []
        }
                
        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(group)
        }

        return urllib.request(Uri.CREATE_GROUP + maxId,settings).then(result => {
            //result: {data: buffer, res: response object}
              return JSON.parse(result.data)
            }).catch( err => {
              throw err
            })

        //return maxId   
    }
            
    async function editGroup(newGroup){
        //Editar grupo, alterando o seu nome e descrição
                
        const settings = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGroup)
        }

        return urllib.request(Uri.CREATE_GROUP + newGroup.id,settings).then(result => {
            //result: {data: buffer, res: response object}
              return JSON.parse(result.data)
            }).catch( err => {
              throw err
            })
    }

    async function deleteGroup(groupId){
        /*let newGroups = groups.filter(group => group.id != groupId)

        if(newGroups.length != groups.length) {
            groups = newGroups
        } else {
            throw ('Resource not found')
        }*/

        const settings = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(group)
        }

        return urllib.request(Uri.GET_GROUP + groupId,settings).then(result => {
            //result: {data: buffer, res: response object}
              return JSON.parse(result.data)
            }).catch( err => {
              throw err
            })
    }

    async function getAllGroups(){
        //Listar todos os grupos

        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.GET_ALL_GROUPS,settings).then(result => {
            //result: {data: buffer, res: response object}
              return JSON.parse(result.data)
            }).catch( err => {
              throw err
            })
            
    }

    async function getGroupDetails(groupId){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.GET_GROUP + groupId,settings).then(result => {
            //result: {data: buffer, res: response object}
              return JSON.parse(result.data)
            }).catch( err => {
              throw err
            })

    }

    async function verifyIfGameExistsInGroup(group, gameId){
        //Adicionar um jogo a um grupo
        const game = group.games.find(game => game.id == gameId)

        if(game){
            throw "Game already exists in this group"
        } 
    }

    async function addGameToGroup(group, game){
        //Adicionar um jogo a um grupo
        //group.games.push(game)
        //Get Game
        let groupGame = group.games.find(groupGame => groupGame.id == game.id)

        if(groupGame){
            throw ("Game already exists in this group")
        } else {
            group.games.push(game)
        }
    }
        
    async function removeGameFromGroup(group, gameId){
        //Remover um jogo de um grupo
        
        let newGames = group.games.filter(game => game.id != gameId)

        if(newGames.length != group.games.length) {
            group.games = newGames

        } else {
            throw 'Resource not found'
        }
    }

    async function getGamesFromGroupWithinRange(group, min, max){

        let filteredGames = group.games.filter(game => game.total_rating > min && game.total_rating < max)

        filteredGames.sort(function(a, b) {
            return b.total_rating - a.total_rating;
          });

        return filteredGames
    }
}