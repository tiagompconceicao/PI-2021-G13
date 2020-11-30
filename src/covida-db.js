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
        removeGameFromGroup,
        getGamesFromGroupWithinRange
    }
     
    function createGroup(groupName, groupDescription, cb){
        //Criar grupo atribuindo-lhe um nome e descrição

        const validId = (groups.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id + 1

        let group = {
                    id: validId,
                    name: groupName,
                    description: groupDescription, 
                    games: []
                }
            
        groups.push(group)
        cb(null)
    }
        
    function editGroup(newGroup, cb){
        //Editar grupo, alterando o seu nome e descrição

        const group = groups.find(group => group.name == newGroup.name)
        if(group) {
            group.name = newGroup.name
            group.description = newGroup.description
            cb(null)
        } else {
            cb('Group not found')
        }
    }

    function getAllGroups(){
        //Listar todos os grupos
        cb(null,groups)
    }

    function getGroupDetails(groupName, cb){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem

        const group = groups.find(group => group.name == groupName)
        group ? cb(null,group) : cb("Group not found")

    }

    function addGameToGroup(group, game, cb){
        //Adicionar um jogo a um grupo

        //Get Game
        let groupGame = group.games.find(groupGame => groupGame.name == game.name)

        if(groupGame){
            cb("Game already exists")
        } else {
            group.games.push(game)
            cb(null)
        }
    }
        
    function removeGameFromGroup(group, gameName, cb){
        //Remover um jogo de um grupo
        
        let newGames = group.games.filter(game => game.name != gameName)

        if(newGames.length != group.games.length) {
            group.games = newGames
            cb(null)
        } else {
            cb('Something went wrong')
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
