

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

        return db.getGroupDetails(groupId).then(group => {
            return db.deleteGroup(group.id)
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
            return db.verifyIfGameExistsInGroup(group,gameId).then(() => {
                return data.getGameById(gameId).then(data => {
                    if(data == null) {
                        throw "Resource not found"
                    } else {
                        return db.addGameToGroup(group, data)
                    }
                }).catch(err => {
                    throw err
                })
            }).catch(err => {
                throw err
            })
        }).catch(err => {
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

        return db.getGroupDetails(groupId).then( group => {
            return db.getGamesFromGroupWithinRange(group, min, max)
        }).catch(err => {
            throw err
        })
    }
}