/** Nossa base de dados, trata de tudo o que for preciso guardar na base de dados */

const groups = require('./groups')

module.exports = {

    createGroup: function (groupName, description, cb){
        //Criar grupo atribuindo-lhe um nome e descrição

        let group = {name: groupName,
                    description: description, 
                    games: []}
        
        groups.push(group)

        //cb(answer(group))
    },
    editGroup: function (groupName, newGroupName, newDescription, cb){
        //Editar grupo, alterando o seu nome e descrição

        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //cb(error)
        }

        group.name = newGroupName
        group.description = newDescription
        //cb(answer(group))
    },
    getAllGroups: function (){
        //Listar todos os grupos

        //cb(answer(groups))
    },
    getGroupDetails: function (groupName, cb){
        //Listar todos os grupos
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem

        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //cb(error)
        }

        //cb(answer(group))
    },
    addGameToGroup: function (groupName, game, cb){
        //Adicionar um jogo a um grupo

        let group = groups.find(group => group.name.equals(groupName))

        if(!group){
            //cb(error)
        }

        group.games.push(game)

        //cb(answer(group))
    },
    removeGameFromGroup: function (groupName, name, cb){
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
}