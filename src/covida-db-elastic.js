/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

const urllib = require("urllib")
//TODO 
//baseUrl tem de mudar, porque agora não temos ligação direta aos grupos, tem de passar por um user
const baseUrl = "http://localhost:9200/groups/"
let groupsId

//TODO 
//Uris agora para chegar a um grupo têm de passar por um user e adicionar uris para o user
const Uri = {
    GROUP: `${baseUrl}group/`,
    GET_ALL_GROUPS: `${baseUrl}_search`,
    UPDATE: `/_update`,
    USER: `${baseUrl}user/`
}

module.exports = function() {
    loadValidGroupId().catch((err) => {
        groupsId = 0
    })

    return {
        createUser,
        editUser,
        deleteUser,
        getUser,
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

    async function loadValidGroupId(){
        const groups = await getAllGroups()
        if(groups.length != 0){
            groupsId = (groups.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id 
        } else {
            groupsId = 0
        }
    }
   
    function createUser(username, password){
        //Criar grupo atribuindo-lhe um nome e descrição

        let user = {
            username: username,
            psassword: password, 
            groups: []
        }
                
        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(user)
        }

        return urllib.request(Uri.USER ,user.username ,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })  
    }

    function editUser(newUser){
        //Editar grupo, alterando o seu nome e/ou descrição
                
        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({"doc" : newUser})
        }

        return urllib.request(Uri.USER + newUser.userName + Uri.UPDATE,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })
    }

    function deleteUser (userName){

        const settings = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.USER + userName, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })
    }

    function getUser (userName){
        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.USER + userName + "/_source",settings).then(result => {
            //result: {data: buffer, res: response object}
            if(JSON.parse(result.data).error) throw "Resource not found"
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })
    }


    //TODO 
    //adicionar e remover grupos de um user
    //temos tambem de criar a dependencia que o grupo tem de um user
            
    function editGroup(newGroup){
        //Editar grupo, alterando o seu nome e/ou descrição
                
        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({"doc" : newGroup})
        }

        return urllib.request(Uri.GROUP + newGroup.id + Uri.UPDATE,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })
    }

    function createGroup(groupName, groupDescription){
        //Criar grupo atribuindo-lhe um nome e descrição

        let group = {
            id: ++groupsId,
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


        return urllib.request(Uri.GROUP + group.id,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })  
    }

    

    function deleteGroup(groupId){
        //Remover grupo

        const settings = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.GROUP + groupId,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })
    }

    function getAllGroups(){
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
            throw err.code
        })
            
    }

    function getGroupDetails(groupId){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.GROUP + groupId + "/_source",settings).then(result => {
            //result: {data: buffer, res: response object}
            if(JSON.parse(result.data).error) throw "Resource not found"
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        })
    }

    function verifyIfGameExistsInGroup(group, gameId){
        //Adicionar um jogo a um grupo
        const game = group.games.find(game => game.id == gameId)

        if(game){
            throw "Game already exists in this group"
        } 
    }

    function addGameToGroup(group, game){
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


        return urllib.request(Uri.GROUP + group.id + Uri.UPDATE,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        }) 
    }
        
    function removeGameFromGroup(group, gameId){
        //Remover um jogo de um grupo
        const game = group.games.find(game => game.id == gameId)
        if(!game) throw "Resource not found"
        
        game.id = Number(game.id)

        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "script": {
                    "inline":"ctx._source.games.remove(ctx._source.games.indexOf(params.game))",
                    "params": {
                            "game" : game
                        }
                    }   
                })
        }

        return urllib.request(Uri.GROUP + group.id + Uri.UPDATE,settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch( err => {
            throw err.code
        }) 
    }

    function getGamesFromGroupWithinRange(group, min, max){
        let filteredGames = group.games.filter(game => game.total_rating > min && game.total_rating < max)

        filteredGames.sort(function(a, b) {
            return b.total_rating - a.total_rating;
          });

        return filteredGames
    }
}