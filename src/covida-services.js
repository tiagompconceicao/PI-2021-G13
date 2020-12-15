
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

    function getGameByName(name, cb){
        //Pesquisar jogos pelo nome
        if(!name){
            cb('Missing arguments')
        }

        data.getGameByName(name, cb)
    }

    function createGroup(groupName, description, cb){
        if(!groupName || !description){
            cb('Missing arguments')
        } else {
            db.createGroup(groupName, description, cb) 
        }
    }
        
    function editGroup(group, cb){
        //Editar grupo, alterando o seu nome e descrição
        if(!group.description || !group.name){
            cb('Missing arguments')
        }

        db.editGroup(group, cb)
    }

    function deleteGroup(groupId, cb){
        if(!groupId){
            cb('Missing arguments')
        }

        db.getGroupDetails(groupId, (err, group) => {
            err ? cb(err) : db.deleteGroup(groupId, cb)
        })   
    }

    function getAllGroups(cb){
        //Listar todos os grupos

        db.getAllGroups(cb)
    }
        
    
    function getGroupDetails(groupId, cb){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if(!groupId){
            cb('Missing arguments')
        }
        
        db.getGroupDetails(groupId,cb)
    }
        
    function addGameToGroup(groupId, gameId, cb){
        //Adicionar um jogo a um grupo
        if(!groupId || !gameId){
            cb('Missing arguments')
        }

        db.getGroupDetails(groupId,(err, group) => {
            err ? cb(err) : db.getGameDetails(group,gameId,(err,game) => {
                if(err){
                    data.getGameById(gameId,(err,data) => {
                        if(err){
                            cb(err)
                        } else if(data) {
                            //let game = data
                            db.addGameToGroup(group, data, cb)
                        } else {
                            cb("Resource not found")
                        }
                    })
                } else {
                    cb("Game already exists in this group")
                }
            })
        })
    }
        
    function removeGameFromGroup(groupId, gameId, cb){
        //Remover um jogo de um grupo
        if(!groupId || !gameId){
            cb('Missing arguments')
        }

        db.getGroupDetails(groupId, (err, group) => {
            err ? cb(err) : db.removeGameFromGroup(group, gameId, cb)
        })   

    }
        
    function getGamesFromGroupWithinRange(groupId, min, max, cb){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média

        if(min > max || min <= 0 || max >= 100){
            return cb('Bad input')
        }

        db.getGroupDetails(groupId, (err, group) => {
            err ? cb(err) : db.getGamesFromGroupWithinRange(group, min, max, cb)
        }) 

    }
}