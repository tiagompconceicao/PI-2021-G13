/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

module.exports = function(groups) {
    if(!groups){
        //create default db
    }

    return {
        createGroup,
        editGroup,
        getAllGroups,
        getGroupDetails,
        addGameToGroup,
        removeGameFromGroup
    }
     
    function createGroup(groupName, groupDescription, cb){
        //Criar grupo atribuindo-lhe um nome e descrição

        let group = {name: groupName,
                    description: groupDescription, 
                    games: []}
            
        groups.push(group)

        //cd success message
        cb(null,'Group added')
    }
        
    function editGroup(groupName, newGroupName, newDescription, cb){
        //Editar grupo, alterando o seu nome e descrição

        //Get Group details
        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //err Group doesnt exist
            cb('Group doesnt exist')
        }

        group.name = newGroupName
        group.description = newDescription

        //Missing db notification
        //cb(null, success message)
    }

    function getAllGroups(){
        //Listar todos os grupos
        cb(groups)
    }

    function getGroupDetails(groupName, cb){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem

        const group = groups.find(group => group.name.equals(groupName))
        group ? cb(null,group) : cb("Group not found")

    }

    function addGameToGroup(groupName, game, cb){
        //Adicionar um jogo a um grupo

        //Get Group details
        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //err Group doesnt exist
            cb("Group not found")
        }

        //Get Game
        let groupGame = group.games.find(groupGame => groupGame.name.equals(game.name))

        if(groupGame){
            //err Game already exists
            cb("Game already exists")
        }

        group.games.push(game)

        //cb(success message)
    }
        
    function removeGameFromGroup(groupName, name, cb){
        //Remover um jogo de um grupo

        //Get Group details
        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //err Group doenst exist
            cb("Group not found")
        }
        
        //Get Game details
        let game = group.games.find(game => game.name.equals(game.name))
        if(!game){
            //err Game to remove doesnt exist
            cb("Game not found")
        }
        //REMOVE GAME from db

        //cd(null,success message)
    }
}
