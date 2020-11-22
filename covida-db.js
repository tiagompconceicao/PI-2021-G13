/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

const groups = require('./groups')

module.exports = {
    createGroup: createGroup,
    editGroup: editGroup,
    getAllGroups: getAllGroups,
    getGroupDetails: getGroupDetails,
    addGameToGroup: addGameToGroup,
    removeGameFromGroup: removeGameFromGroup
}
     
function createGroup(groupName, description, cb){
    //Criar grupo atribuindo-lhe um nome e descrição

    let group = {name: groupName,
                description: description, 
                games: []}
        
    groups.push(group)

    //cb(answer(group))
}
     
function editGroup(groupName, newGroupName, newDescription, cb){
    //Editar grupo, alterando o seu nome e descrição

    let group = groups.find(group => group.name.equals(groupName))

    if(!group){
        //cb(error)
    }

    group.name = newGroupName
    group.description = newDescription
    //cb(answer(group))
}

function getAllGroups(){
    //Listar todos os grupos

    //cb(answer(groups))
}

function getGroupDetails(groupName, cb){
    //Listar todos os grupos
    //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem

    let group = groups.find(group => group.name.equals(groupName))

    if(!group){
        //cb(error)
    }

    //cb(answer(group))
}

function addGameToGroup(groupName, game, cb){
    //Adicionar um jogo a um grupo

    let group = groups.find(group => group.name.equals(groupName))

    if(!group){
        //cb(error)
    }

    group.games.push(game)

    //cb(answer(group))
}
     
function removeGameFromGroup(groupName, name, cb){
    //Remover um jogo de um grupo
    let group = groups.find(group => group.name.equals(groupName))

    if(!group){
        //cb(error)
    }

    for (const game of group.games){
        if(game.name.equals(name)){
            //cb(answer(game))
        }
    }
    //cb(error)
}
