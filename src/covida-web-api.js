/* criar todas as funcionalidades  */


module.exports = function(services){
    if(!services){
        throw 'Invalid services object'
    }

    return {
        getPopularGames,
        getGameByName,
        createGroup,
        editGroup,
        getAllGroups,
        getGroupDetails,
        addGameToGroup,
        removeGameFromGroup,
        getGamesFromGroupWithinRange
    }
    //this functions will call a method from services which fulfills the request (req), 
    //and prepares the response (res), for example with the status code 200 OK

    function getPopularGames(req, res){
        //Obter a lista dos jogos mais populares
    }

    function getGameByName(req, res){
        //Pesquisar jogos pelo nome
    }

    function createGroup(req, res){
        //Criar grupo atribuindo-lhe um nome e descrição
    }

    function editGroup(req, res){
        //Editar grupo, alterando o seu nome e descrição
    }

    function getAllGroups(req,res){
        //Listar todos os grupos
    }

    function getGroupDetails(req, res){
    //Listar todos os grupos
    //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
    }

    function addGameToGroup(req, res){
        //Adicionar um jogo a um grupo
    }
        
    function removeGameFromGroup(req, res){
        //Remover um jogo de um grupo
    }
        
    function getGamesFromGroupWithinRange(req, res){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média
    }
}