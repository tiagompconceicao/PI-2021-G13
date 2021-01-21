/* Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

module.exports = function(users) {
    if(!users){
        users = require('./initialGroups')

    }

    return {
        createUser,
        editUser,
        deleteUser,
        addGroupToUser,
        removeGroupFromUser,
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
     
    async function createUser(userName, userPassword){
        //Criar grupo atribuindo-lhe um nome e descrição
        
        let validId
        if(users.length != 0){
        validId = (users.reduce((prev, current) => (prev.id > current.id) ? prev : current)).id + 1
        } else {
            validId = 1
        }
            
        let user = {
            id: validId,
            username: userName,
            password: userPassword, 
            groups: []
        }
                
        users.push(user)

        return validId   
    }

    async function editUser(newUser){
        //Editar grupo, alterando o seu nome e descrição

        const user = users.find(user => user.id == newUser.id)
        if(user) {
            if(newUser.username) user.username = newUser.username
            if(newUser.password) user.password = newUser.password
        } else {
            throw 'Resource not found'
        }
    }

    async function deleteUser(userId){
        let newUsers = users.filter(user => user.id != userId)

        if(newUsers.length != users.length) {
            users = newUsers
        } else {
            throw ('Resource not found')
        }
    }

    async function addGroupToUser(user, group){
        //Adicionar um grupo a um user
        //user.groups.push(group)
        //Get group
        let userGroup = user.groups.find(userGroup => userGroup.id == userGroup.id)

        if(userGroup){
            throw ("Group already exists in this User")
        } else {
            user.groups.push(group)
        }
    }
        
    async function removeGroupFromUser(user, groupId){
        //Remover um grupo de um user
        
        let newGroups = user.groups.filter(group => group.id != groupId)

        if(newGroups.length != user.groups.length) {
            user.groups = newGroups

        } else {
            throw 'Resource not found'
        }
    }

    async function createGroup(groupName, groupDescription){
        //Criar grupo atribuindo-lhe um nome e descrição
        
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

        return validId   
    }
            
    async function editGroup(newGroup){
        //Editar grupo, alterando o seu nome e descrição

        const group = groups.find(group => group.id == newGroup.id)
        if(group) {
            if(newGroup.name) group.name = newGroup.name
            if(newGroup.description) group.description = newGroup.description
        } else {
            throw 'Resource not found'
        }
    }

    async function deleteGroup(groupId){
        let newGroups = groups.filter(group => group.id != groupId)

        if(newGroups.length != groups.length) {
            groups = newGroups
        } else {
            throw ('Resource not found')
        }
    }

    async function getAllGroups(){
        //Listar todos os grupos
        return groups
    }

    async function getGroupDetails(groupId){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem

        const group = groups.find(group => group.id == groupId)
        if(group){
           return group 
        } else {
            throw "Resource not found"
        }

    }

    async function verifyIfGameExistsInGroup(group, gameId){
        //Adicionar um jogo a um grupo
        const game = group.games.find(game => game.id == gameId)

        if(game){
            throw "Game already exists in this group"
        } 
    }

    async function addGameToGroup(group, game){
        //Adicionar um jogo a um grupo
        //group.games.push(game)
        //Get Game
        let groupGame = group.games.find(groupGame => groupGame.id == game.id)

        if(groupGame){
            throw ("Game already exists in this group")
        } else {
            group.games.push(game)
        }
    }
        
    async function removeGameFromGroup(group, gameId){
        //Remover um jogo de um grupo
        
        let newGames = group.games.filter(game => game.id != gameId)

        if(newGames.length != group.games.length) {
            group.games = newGames

        } else {
            throw 'Resource not found'
        }
    }

    async function getGamesFromGroupWithinRange(group, min, max){

        let filteredGames = group.games.filter(game => game.total_rating > min && game.total_rating < max)

        filteredGames.sort(function(a, b) {
            return b.total_rating - a.total_rating;
          });

        return filteredGames
    }
}
