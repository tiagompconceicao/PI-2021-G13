/*Obter a lista dos jogos mais populares
Pesquisar jogos pelo nome
Gerir grupos de jogos favoritos
Criar grupo atribuindo-lhe um nome e descrição
Editar grupo, alterando o seu nome e descrição
Listar todos os grupos
Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem.
Adicionar um jogo a um grupo
Remover um jogo de um grupo
Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores (mínimo e máximo) entre 0 e 100, 
sendo estes valores parametrizáveis no pedido. Os jogos vêm ordenadas por ordem decrescente da votação média.
*/

const tasksDb = require ("./covida-db")

module.exports = {
    getPopularGames: getPopularGames,
    getGameByName: getGameByName,
    createGroup: createGroup,
    editGroup: editGroup,
    getAllGroups: getAllGroups,
    getGroupDetails: getGroupDetails,
    addGameToGroup: addGameToGroup,
    removeGameFromGroup: removeGameFromGroup,
    getGamesFromGroupWithinRange: getGamesFromGroupWithinRange
}
     
function getPopularGames(cb){
    //Obter a lista dos jogos mais populares

    data.getPopularGames()
}

function getGameByName(name, cb){
    //Pesquisar jogos pelo nome

    data.getGameByName(name)
}

function createGroup(groupName, description, cb){
    //Criar grupo atribuindo-lhe um nome e descrição

    //todo verificar seo nome e a descricao estao vazios, se sim da erro
    db.createGroup(groupName, description)    
}
     
function editGroup(groupName, newGroupName, newDescription, cb){
    //Editar grupo, alterando o seu nome e descrição

    //todo verificar se o grupo com groupName existe e se o nome e a descricao nao sao vazios 
    //senao da erro
    db.editGroup(groupName, newGroupName, newDescription)
}

function getAllGroups(cb){
    //Listar todos os grupos

    db.getAllGroups()
}
    
function getGroupDetails(groupName, cb){
    //Listar todos os grupos
    //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem

    //todo verificar se o grupo com groupName existe senao da erro
    db.getGroupDetails(groupName)
}
     
function addGameToGroup(groupName, name, cb){
    //Adicionar um jogo a um grupo

    //todo verificar se o grupo com groupName existe e se o jogo existe senao da erro 

    db.addGameToGroup(groupName, data.getGameByName(name))
}
     
function removeGameFromGroup(groupName, name, cb){
    //Remover um jogo de um grupo

    // todo verificar se o jogo com nome :name existe no grupo com nome groupName, se não existir da erro

    db.removeGameFromGroup(groupName, name)
}
     
function getGamesFromGroupWithinRange(groupName, min, max, cb){
    //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
    //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
    //vêm ordenadas por ordem decrescente da votação média

    if(min > max){
        return cb(error)
    }
    data.getGamesFromGroupWithinRange(groupName, min, max)
}
