

module.exports = function(data,db) {
    if(!data){
        throw 'Invalid data object'
    }
    if(!db){
        throw 'Invalid db object'
    }

    return {
        getGameByName,
        createGroup,
        editGroup,
        deleteGroup,
        getAllGroups,
        getGroupDetails,
        addGameToGroup,
        removeGameFromGroup,
        getGamesFromGroupWithinRange
    }

    async function getGameByName(name){
        //Pesquisar jogos pelo nome

        return data.getGameByName(name)
    }

    async function createGroup(groupName, description){
        if(!groupName || !description){
            throw 'Missing arguments'
        } else {
            return db.createGroup(groupName, description) 
        }
    }
        
    async function editGroup(group){
        //Editar grupo, alterando o seu nome e descrição
        if(!group.description || !group.name){
            throw 'Missing arguments'
        }
        return db.editGroup(group)
    }

    async function deleteGroup(groupId){
        if(!groupId){
            throw 'Missing arguments'
        }

        db.getGroupDetails(groupId).then(group => {
            return db.deleteGroup(groupId)
        }).catch( err => {
            throw err
        }) 
    }

    async function getAllGroups(){
        //Listar todos os grupos

        return db.getAllGroups()
    }
        
    
    async function getGroupDetails(groupId){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if(!groupId){
            throw 'Missing arguments'
        }
        
        return db.getGroupDetails(groupId)
    }
        
    async function addGameToGroup(groupId, gameId){
        //Adicionar um jogo a um grupo
        if(!groupId || !gameId){
            throw 'Missing arguments'
        }

        return db.getGroupDetails(groupId).then(group => {
            return db.getGameDetails(group,gameId).then( game => {
                console.log("Entrou no then,function addGameToGroup => getGameDetails")
                //Smell bad... this throw goes to the getGameDetails catch
                throw "Game already exists in this group"
            }).catch(err => {
                return data.getGameById(gameId).then(data => {
                    if(data == null) {
                        console.log("Entrou no catch,function addGameToGroup => getGameById")
                        throw "Resource not found"
                    } else {
                        console.log("----------------------")
                        return db.addGameToGroup(group, data)
                    }
                }).catch(err => {
                    console.log("Entrou no catch,function addGameToGroup => getGameDetails")
                    throw err
                })
            })
        }).catch(err => {
            console.log("Entrou no catch,function addGameToGroup => getGroupDetails")
            throw err
        })
    }
        
    async function removeGameFromGroup(groupId, gameId){
        //Remover um jogo de um grupo
        if(!groupId || !gameId){
            throw 'Missing arguments'
        }

        return db.getGroupDetails(groupId).then(group => {
            return db.removeGameFromGroup(group, gameId)
        }).catch(err => {
            throw err
        })
    }
        
    async function getGamesFromGroupWithinRange(groupId, min, max){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média

        if(min > max || min <= 0 || max >= 100){
            throw 'Bad input'
        }

        db.getGroupDetails(groupId).then( group => {
            return db.getGamesFromGroupWithinRange(group, min, max)
        }).catch(err => {
            throw err
        })
    }
}