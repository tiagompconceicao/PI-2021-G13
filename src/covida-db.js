/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

module.exports = function(groups) {
    if(!groups){
        groups = require('./initialGroups')

    }

    return {
        createGroup,
        editGroup,
        getAllGroups,
        getGroupDetails,
        addGameToGroup,
        removeGameFromGroup,
        getGamesFromGroupWithinRange
    }
     
    function createGroup(groupName, groupDescription, cb){
        //Criar grupo atribuindo-lhe um nome e descrição
        
        const group = groups.find(group => group.name == groupName )

        if(group) {
            cb("Group already exists")
        } else {

            let validId
            if(groups.length != 0){
                validId = (groups.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id + 1
            } else {
                validId = 1
            }
            

            let group = {
                        id: validId,
                        name: groupName,
                        description: groupDescription, 
                        games: []
                    }
                
            groups.push(group)
            cb(null,validId)

        }      
    }
            
    function editGroup(newGroup, cb){
        //Editar grupo, alterando o seu nome e descrição

        const group = groups.find(group => group.id == newGroup.id)
        if(group) {
            const dGroup = groups.find(group => group.name == newGroup.name)
            if(dGroup){
                cb("Already exists a group with this name")
            } else {
                group.name = newGroup.name
                group.description = newGroup.description
                cb(null)
            }
        } else {
            cb('Resource not found')
        }
    }

    function getAllGroups(cb){
        //Listar todos os grupos
        cb(null,groups)
    }

    function getGroupDetails(groupId, cb){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem

        const group = groups.find(group => group.id == groupId)
        group ? cb(null,group) : cb("Resource not found")

    }

    function addGameToGroup(group, game, cb){
        //Adicionar um jogo a um grupo

        //Get Game
        let groupGame = group.games.find(groupGame => groupGame.id == game.id)

        if(groupGame){
            cb("Game already exists in this group")
        } else {
            group.games.push(game)
            cb(null)
        }
    }
        
    function removeGameFromGroup(group, gameId, cb){
        //Remover um jogo de um grupo
        
        let newGames = group.games.filter(game => game.id != gameId)

        if(newGames.length != group.games.length) {
            group.games = newGames
            cb(null)
        } else {
            cb('Resource not found')
        }
    }

    function getGamesFromGroupWithinRange(group, min, max, cb){

        let filteredGames = group.games.filter(game => game.total_rating > min && game.total_rating < max)

        filteredGames.sort(function(a, b) {
            return b.total_rating - a.total_rating;
          });

        cb(null ,filteredGames)
    }
}
