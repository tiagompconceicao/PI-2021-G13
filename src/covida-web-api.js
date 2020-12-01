/* criar todas as funcionalidades  */


module.exports = function(services){
    if(!services){
        throw 'Invalid services object'
    }

    return {
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
        const name = req.params.gameName

        services.getGameByName(name, (err, game) => {
            if(err) {
                handlerErr(req, rsp, err)
            } else {
                rsp.json(game)
            }
        })

        
    }

    function createGroup(req, rsp){
        //Criar grupo atribuindo-lhe um nome e descrição

        const group = { name: req.body.name, description: req.body.description }

        services.createGroup(group.name, group.description, processCreateGroup )


        function processCreateGroup(err){
            if(err){
                //sendBadRequest status code 400
                handlerErr(req, rsp, err)
            } else {
                sendChangeSuccess(req, rsp, group.name, "created")
            }
        }
    }

    function editGroup(req, rsp){
        //Editar grupo, alterando o seu nome e descrição
        const group = { description: req.body.description }
        group.name = req.params.groupName

        services.editGroup(group, (err) => {
            if(err){
                handlerErr(req, rsp, err)
            } else {
                sendChangeSuccess(req, rsp, group.name, "edited")
            }
        })
    }

    function getAllGroups(req,rsp){
        //Listar todos os grupos
        services.getAllGroups(groups => rsp.json(groups))
    }

    function getGroupDetails(req, rsp){
    //Listar todos os grupos
    //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
    const groupName = req.params.groupName

    services.getGroupDetails(groupName, (err, group) => {
        if(err){
            handlerErr(req, rsp, err)
        } else {
            rsp.json(group)
        }
    })
    }

    function addGameToGroup(req, rsp){
        //Adicionar um jogo a um grupo
        const game = req.body
        const groupName = req.params.groupName

        services.addGameToGroup(groupName, game, (err) => {
            if(err){
                handlerErr(req, rsp, err)
            } else {
                sendChangeGameSuccess(req, rsp, game.name, groupName, "added")
            }
        })
        
    }
        
    function removeGameFromGroup(req, rsp){
        //Remover um jogo de um grupo
        const groupName = req.params.groupName
        const gameName = req.params.gameName
        services.removeGameFromGroup(groupName,gameName,processDelete)

        function processDelete(err) {
            if(err) {
                handlerErr(req, rsp, err)
            }
            sendChangeGameSuccess(req, rsp, gameName, groupName, "deleted")
          }
    }
        
    function getGamesFromGroupWithinRange(req, rsp){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média
        const groupName = req.params.groupName
        const min = req.params.min
        const max = req.params.max

        services.getGamesFromGroupWithinRange(groupName, min, max, (err , games) => {
            if(err){
                handlerErr(req, rsp, err)
            } else {
                rsp.json(games)
            }
        })
    }

    function handlerErr(req, rsp, err){
        switch(err){
            case "Something went wrong":
                //Something went wrong status code 500 Internal server Error
                sendServerError(req, rsp, err)
              break
            case "Resource not found":
                //status code 404
                sendNotFound(rsp,err)
                break
            case "Group already exists":
            case "Bad input":
            case "Missing arguments":
                //Bad request status code 400
                sendBadRequest(rsp, err)
                break

        }
    }

    function sendServerError(req, rsp, error){
        rsp.status(500).json({
            error:new Error(error , req.originalUrl)}
            )
    }

    function sendNotFound(rsp, err) {
        rsp.status(404).json({error:err})
    }

    function sendBadRequest(rsp, err) {
        rsp.status(400).json({error:err})
    } 



    function sendChangeSuccess(req, rsp, name, changeType, urlSuffix = "") {
        rsp.json({
          status : `Group with name ${name} ${changeType}`,
          uri: req.originalUrl + urlSuffix
        })
    }

    function sendChangeGameSuccess(req, rsp, gameName, groupName, changeType, urlSuffix = "") {
        rsp.json({
          status : `Game with name ${gameName} of group with name ${groupName} ${changeType}`,
          uri: req.originalUrl + urlSuffix
        })
    }
}