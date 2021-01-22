/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

const { Console } = require("console")
const urllib = require("urllib")

const baseUrl = "http://localhost:9200/"
let groupsId

const Uri = {
    GROUP: `${baseUrl}groups/group/`,
    GET_ALL_GROUPS: `${baseUrl}groups/_search`,
    GET_ALL_USERS: `${baseUrl}users/_search`,
    UPDATE: `/_update`,
    USER: `${baseUrl}users/user/`
}

module.exports = function () {
    loadValidGroupId().catch((err) => {
        groupsId = 0
    })

    return {
        createUser,
        editUser,
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

    async function loadValidGroupId() {
        const groups = await getAllGroups()
        if (groups.length != 0) {
            groupsId = (groups.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id
        } else {
            groupsId = 0
        }
    }

    function createUser(username, password) {
        //Criar grupo atribuindo-lhe um nome e descrição

        let user = {
            username: username,
            password: password,
            groups: []
        }

        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(user)
        }

        return urllib.request(Uri.USER + username, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    //ver aqui comparar com o deles

    function editUser(newUser) {
        //Editar User, alterando o seu nome e/ou descrição

        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ "doc": newUser })
        }

        return urllib.request(Uri.USER + newUser.username + Uri.UPDATE, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function getUser(username) {
        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.USER + username + "/_source", settings).then(result => {
            //result: {data: buffer, res: response object}
            if (JSON.parse(result.data).error) throw "Resource not found"
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function editGroup(newGroup) {
        //Editar grupo, alterando o seu nome e/ou descrição

        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ "doc": newGroup })
        }

        return urllib.request(Uri.GROUP + newGroup.id + Uri.UPDATE, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function createGroup(groupName, groupDescription) {
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


        return urllib.request(Uri.GROUP + group.id, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function deleteGroup(groupId) {
        //Remover grupo

        const settings = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.GROUP + groupId, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function getAllGroups(username) {
        //Listar todos os grupos

        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.USER + username + "/_source", settings).then(result => {
            //result: {data: buffer, res: response object}
            
            if (JSON.parse(result.data).error) throw "Resource not found"
            let user = JSON.parse(result.data)
            let groups = []
            if(user.groups.length == 0){ 
                throw "Missing arguments"
            }else{
                user.groups.forEach(groupId => {
                    groups.push(getGroupDetails(groupId))
                });
                return groups
            }
        }).catch(err => {
            throw err
        })

        /*
        return urllib.request(Uri.GET_ALL_GROUPS, settings).then(result => {
            //result: {data: buffer, res: response object}
            let groups = JSON.parse(result.data).hits.hits
            groups = groups.map(group => group = group._source)
            return groups
        }).catch(err => {
            throw err
        })*/

    }

    function getAllUsers() {
        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return urllib.request(Uri.GET_ALL_USERS, settings).then(result => {
            //result: {data: buffer, res: response object}
            let users = JSON.parse(result.data).hits.hits
            users = users.map(user => user = user._source)
            return users
        }).catch(err => {
            throw err
        })

    }

    function getGroupDetails(groupId) {
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        const settings = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }

        
        return urllib.request(Uri.GROUP + groupId + "/_source", settings).then(result => {
            //result: {data: buffer, res: response object}
            if (JSON.parse(result.data).error) throw "Resource not found"
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function verifyIfGameExistsInGroup(group, gameId) {
        //Adicionar um jogo a um grupo
        const game = group.games.find(game => game.id == gameId)

        if (game) {
            throw "Game already exists in this group"
        }
    }

    function addGameToGroup(group, game) {
        //Adicionar um jogo a um grupo

        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "script": {
                    "inline": "ctx._source.games.add(params.game)",
                    "params": {
                        game
                    }
                }
            })
        }


        return urllib.request(Uri.GROUP + group.id + Uri.UPDATE, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function removeGameFromGroup(group, gameId) {
        //Remover um jogo de um grupo
        const game = group.games.find(game => game.id == gameId)
        if (!game) throw "Resource not found"

        game.id = Number(game.id)

        const settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "script": {
                    "inline": "ctx._source.games.remove(ctx._source.games.indexOf(params.game))",
                    "params": {
                        "game": game
                    }
                }
            })
        }

        return urllib.request(Uri.GROUP + group.id + Uri.UPDATE, settings).then(result => {
            //result: {data: buffer, res: response object}
            return JSON.parse(result.data)
        }).catch(err => {
            throw err
        })
    }

    function getGamesFromGroupWithinRange(group, min, max) {
        let filteredGames = group.games.filter(game => game.total_rating > min && game.total_rating < max)

        filteredGames.sort(function (a, b) {
            return b.total_rating - a.total_rating;
        });

        return filteredGames
    }
}