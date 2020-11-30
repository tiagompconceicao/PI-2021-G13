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

    function getGameByName(req, rsp){
        //Pesquisar jogos pelo nome
        services.getGameByName(req.params.gameName, () => {

        })

        
    }

    function createGroup(req, rsp){
        //Criar grupo atribuindo-lhe um nome e descrição

        const group = { name: req.body.name, description: req.body.description}

        services.createGroup(group.name, group.description, processCreateGroup )


        function processCreateGroup(err){
            if(err){
                //sendBadRequest status code 400
            } else {
                sendChangeSuccess(req, rsp, group.id, "created")
            }
        }
    }

    function editGroup(req, rsp){
        //Editar grupo, alterando o seu nome e descrição
    }

    function getAllGroups(req,rsp){
        //Listar todos os grupos
        services.getAllGroups(groups => rsp.json(groups))
    }

    function getGroupDetails(req, rsp){
    //Listar todos os grupos
    //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
    }

    function addGameToGroup(req, rsp){
        //Adicionar um jogo a um grupo
    }
        
    function removeGameFromGroup(req, rsp){
        //Remover um jogo de um grupo
        const groupName = req.params.groupName
        const gameName = req.params.gameName
        services.removeGameFromGroup(groupName,gameName,processDelete)

        function processDelete(err) {
            if(err) {
                handlerErr(err)
            }
            sendChangeSuccess(req, rsp, id, "deleted")
          }
    }
        
    function getGamesFromGroupWithinRange(req, rsp){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média
    }

    function handlerErr(err){
        switch(err){
            case 'Something went wrong':
                //Something went wrong status code 500 Internal server Error
              break
            case 'Group not found':
                //status code 404
                sendNotFound(req, rsp)
                break
            case 'Missing arguments':
                //Bad request status code 400
                break

        }
    }

    function sendNotFound(req, rsp) {
        rsp.status(404).json(new Error("Resource not found", req.originalUrl))
      }


     function sendChangeSuccess(req, rsp, id, changeType, urlSuffix = "") {
        rsp.json({
          status : `Group with id ${id} ${changeType}`,
          uri: req.originalUrl + urlSuffix
        })
      }
}