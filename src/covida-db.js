/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

module.exports = function(groups) {
    if(!groups){
        throw 'Invalid groups object'
    }

    return {
        createGroup,
        editGroup,
        getAllGroups,
        getGroupDetails,
        addGameToGroup,
        removeGameFromGroup
    }
     
    function createGroup(name, description, cb){
        //Criar grupo atribuindo-lhe um nome e descrição

        //Get Group details
        let group = groups.find(group => group.name.equals(name))

        if(group){
            //Group already exists
            cb("Group already exists")
        }

        let group = {name: name,
                    description: description, 
                    games: []}
            
        groups.push(group)

        //cd success message
        //cb(group)
    }
        
    function editGroup(groupName, newGroupName, newDescription, cb){
        //Editar grupo, alterando o seu nome e descrição

        //Get Group details
        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //Group doesnt exist
            //cb(error)
        }

        group.name = newGroupName
        group.description = newDescription

        //cd group ou success message
        //cb(group)
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
            //Group doesnt exist
            cb("Group not found")
        }

        //Get Game
        let groupGame = group.games.find(groupGame => groupGame.name.equals(game.name))

        if(groupGame){
            //Game already exists
            cb("Game already exists")
        }

        group.games.push(game)

        //cd success message
        //cb(group)
    }
        
    function removeGameFromGroup(groupName, name, cb){
        //Remover um jogo de um grupo

        //Get Group details
        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //Group doenst exist
            cb("Group not found")
        }
        
        //Get Game details
        let game = group.games.find(game => game.name.equals(game.name))
        if(!game){
            //Game to remove doesnt exist
            cb("Game not found")
        }

        //REMOVE GAME

        //cd success message
        cd(null,game)
    }
}
