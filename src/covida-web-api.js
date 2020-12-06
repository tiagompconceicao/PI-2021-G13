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
                handlerErr(rsp, err)
            } else {
                rsp.json(game)
            }
        })

        
    }

    function createGroup(req, rsp){
        //Criar grupo atribuindo-lhe um nome e descrição

        const group = { name: req.body.name, description: req.body.description }

        services.createGroup(group.name, group.description, processCreateGroup )


        function processCreateGroup(err,id){
            if(err){
                //sendBadRequest status code 400
                handlerErr(rsp, err)
            } else {
                sendChangeSuccess(req, rsp, id, "created")
            }
        }
    }

    function editGroup(req, rsp){
        //Editar grupo, alterando o seu nome e descrição
        const group = { name : req.body.name, description: req.body.description }
        group.id = req.params.groupId

        services.editGroup(group, (err) => {
            if(err){
                handlerErr(rsp, err)
            } else {
                sendChangeSuccess(req, rsp, group.id, "edited")
            }
        })
    }

    function getAllGroups(req,rsp){
        //Listar todos os grupos
        services.getAllGroups((err,groups) => rsp.json(groups))
    }

    function getGroupDetails(req, rsp){
    //Listar todos os grupos
    //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
    const groupId = req.params.groupId

    services.getGroupDetails(groupId, (err, group) => {
        if(err){
            handlerErr(rsp, err)
        } else {
            rsp.json(group)
        }
    })
    }

    function addGameToGroup(req, rsp){
        //Adicionar um jogo a um grupo
        const gameId = req.params.gameId
        const groupId = req.params.groupId

        services.addGameToGroup(groupId, gameId, (err) => {
            if(err){
                handlerErr(rsp, err)
            } else {
                sendChangeGameSuccess(req, rsp, gameId, groupId, "added")
            }
        })
        
    }
        
    function removeGameFromGroup(req, rsp){
        //Remover um jogo de um grupo
        const gameId = req.params.gameId
        const groupId = req.params.groupId
        services.removeGameFromGroup(groupId,gameId,processDelete)

        function processDelete(err) {
            if(err) {
                handlerErr(rsp, err)
            }
            sendChangeGameSuccess(req, rsp, gameId, groupId, "deleted")
          }
    }
        
    function getGamesFromGroupWithinRange(req, rsp){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média
        const groupId = req.params.groupId
        const min = req.params.min
        const max = req.params.max

        services.getGamesFromGroupWithinRange(groupId, min, max, (err , games) => {
            if(err){
                handlerErr(rsp, err)
            } else {
                rsp.json(games)
            }
        })
    }

    function handlerErr(rsp, err){
        switch(err){
            case "Resource not found":
                //status code 404
                sendNotFound(rsp,err)
                break
            case "Already exists a group with this name":
            case "Game already exists in this group":
            case "Group already exists":
                //409 Conflict
                sendConflict(rsp, err)
            case "Bad input":
            case "Missing arguments":
                //Bad request status code 400
                sendBadRequest(rsp, err)
                break
        }
    }

    function sendConflict(rsp, err){
        rsp.status(409).json({error:err})
    }

    function sendNotFound(rsp, err) {
        rsp.status(404).json({error:err})
    }

    function sendBadRequest(rsp, err) {
        rsp.status(400).json({error:err})
    } 



    function sendChangeSuccess(req, rsp, name, changeType, urlSuffix = "") {
        rsp.json({
          status : `Group with id ${name} ${changeType}`,
          uri: req.originalUrl + urlSuffix
        })
    }

    function sendChangeGameSuccess(req, rsp, gameName, groupName, changeType) {
        rsp.json({
          status : `Game with id ${gameName} ${changeType} in group with id ${groupName}`,
          uri: req.originalUrl
        })
    }
}