/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

const urllib = require("urllib")
const baseUrl = "http://localhost:9200/groups/"
let validId

const Uri = {
    CREATE_GROUP: `${baseUrl}group/`,
    GET_GROUP: `${baseUrl}group/`,
    GET_ALL_GROUPS: `${baseUrl}_search`,
    UPDATE: `/_update`
}

module.exports = function() {
    loadValidId().catch((err) => {
        validId = 0
    })

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

    async function loadValidId(){
        //Not correct , must get highest id and not the counter of ids
        const groups = await getAllGroups()
        if(groups.length != 0){
            validId = (groups.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id 
        } else {
            validId = 0
        }
    }
     
    async function createGroup(groupName, groupDescription){
        //Criar grupo atribuindo-lhe um nome e descrição

        let group = {
            id: ++validId,
            name: groupName,
            description: groupDescription, 
            games: []
        }
                
        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(group)
        }


        return urllib.request(Uri.CREATE_GROUP + group.id,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err
        })  
    }
            
    async function editGroup(newGroup){
        //Editar grupo, alterando o seu nome e/ou descrição
                
        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({"doc" : newGroup})
        }

        return urllib.request(Uri.CREATE_GROUP + newGroup.id+"/_update",settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err
        })
    }

    async function deleteGroup(groupId){
        //Remover grupo

        const settings = {
            method: "DELETE",
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
            let groups = JSON.parse(result.data).hits.hits
            groups = groups.map(group => group = group._source)
            return groups
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

        return urllib.request(Uri.GET_GROUP + groupId + "/_source",settings).then(result => {
            //result: {data: buffer, res: response object}
            if(JSON.parse(result.data).error) throw "Resource not found"
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

        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "script": {
                    "inline":"ctx._source.games.add(params.game)",
                    "params": {
                        game
                        }
                    }   
                })
        }


        return urllib.request(Uri.CREATE_GROUP + group.id + Uri.UPDATE,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err
        }) 
    }
        
    async function removeGameFromGroup(group, gameId){
        //Remover um jogo de um grupo
        
        //Not done...
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