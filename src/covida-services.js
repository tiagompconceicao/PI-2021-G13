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
        getAllGroups,
        getGroupDetails,
        addGameToGroup,
        removeGameFromGroup,
        getGamesFromGroupWithinRange
    }
     
    /*function getPopularGames(cb){
        //Obter a lista dos jogos mais populares
        data.getPopularGames()
    }*/

    function getGameByName(name, cb){
        //Pesquisar jogos pelo nome
        if(!name){
            cb('Missing arguments')
        }

        data.getGameByName(name, cb)
    }

    function createGroup(groupName, description, cb){
        console.log(!groupName || !description)
        if(!groupName || !description){
            cb('Missing arguments')
        } else {

            db.getGroupDetails(groupName, (err, group) => {
                if(err) {
                    db.createGroup(groupName, description, cb) 
                } else {
                    cb('Group already exists')
                }
            })
        }

         
       
    }
        
    function editGroup(group, cb){
        //Editar grupo, alterando o seu nome e descrição
        if(!group){
            cb('Missing arguments')
        }

        db.editGroup(group, cb)
    }

    function getAllGroups(cb){
        //Listar todos os grupos

        db.getAllGroups(cb)
    }
        
    
    function getGroupDetails(groupName, cb){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if(!groupName){
            cb('Missing arguments')
        }
        
        db.getGroupDetails(groupName,cb)
    }
        
    function addGameToGroup(groupName, game, cb){
        //Adicionar um jogo a um grupo
        if(!groupName || !game.name){
            cb('Missing arguments')
        }

        db.getGroupDetails(groupName, (err, group) => {
            err ? cb(err) : db.addGameToGroup(group, game, cb)
        })            

    }
        
    function removeGameFromGroup(groupName, gameName, cb){
        //Remover um jogo de um grupo
        if(!groupName || !gameName){
            cb('Missing arguments')
        }

        db.getGroupDetails(groupName, (err, group) => {
            err ? cb(err) : db.removeGameFromGroup(group, gameName, cb)
        })   

    }
        
    function getGamesFromGroupWithinRange(groupName, min, max, cb){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média

        if(min > max || min < 0 || max > 100){
            return cb('Bad input')
        }

        db.getGroupDetails(groupName, (err, group) => {
            err ? cb(err) : db.getGamesFromGroupWithinRange(group, min, max, cb)
        }) 

    }
}