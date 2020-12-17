/* criar todas as funcionalidades  */


module.exports = function(services){
    if(!services){
        throw 'Invalid services object'
    }

    return {
        getGameByName,
        createGroup,
        editGroup,
        deleteGroup,
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

        services.getGameByName(name).then((game) => {
            //rsp.json(JSON.parse(game.data))
            rsp.json(game)
        }).catch(err => {
            handleError(req, rsp, err)
        })
    }

    function createGroup(req, rsp){
        //Criar grupo atribuindo-lhe um nome e descrição

        const group = { name: req.body.name, description: req.body.description }

        services.createGroup(group.name, group.description).then(id => {
            sendGroupChangeSuccess(req, rsp, id, "created")
        }).catch(err => {
            handleError(req, rsp, err)
        })

    }

    function editGroup(req, rsp){
        //Editar grupo, alterando o seu nome e descrição
        const group = { name : req.body.name, description: req.body.description }
        group.id = req.params.groupId

        services.editGroup(group).then(() => {
            sendGroupChangeSuccess(req, rsp, group.id, "edited")
        }
        ).catch(err => 
            handleError(req, rsp, err)
        )
    }

    function deleteGroup(req, rsp){
        //Remover um grupo
        const groupId = req.params.groupId

        services.deleteGroup(groupId).then(() => {
            sendGroupChangeSuccess(req, rsp, groupId, "deleted")}
        ).catch(err => 
            handleError(req, rsp, err)
        )
    }

    function getAllGroups(req,rsp){
        //Listar todos os grupos
        services.getAllGroups().then( groups =>
            rsp.json(groups)
        )
        
    }

    function getGroupDetails(req, rsp){
    //Listar todos os grupos
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        const groupId = req.params.groupId

        services.getGroupDetails(groupId).then(group => 
            rsp.json(group)
        ).catch(err => handleError(req, rsp, err)) 
    
    }

    function addGameToGroup(req, rsp){
        //Adicionar um jogo a um grupo
        const gameId = req.params.gameId
        const groupId = req.params.groupId

        services.addGameToGroup(groupId, gameId).then(() => {
            sendGameChangeSuccess(req, rsp, gameId, groupId, "added")}
        ).catch(err => {
            handleError(req, rsp, err)
        })
        
    }
        
    function removeGameFromGroup(req, rsp){
        //Remover um jogo de um grupo
        const gameId = req.params.gameId
        const groupId = req.params.groupId

        services.removeGameFromGroup(groupId,gameId).then(() => {
            sendGameChangeSuccess(req, rsp, gameId, groupId, "deleted")}
        ).catch(err => {
            handleError(req, rsp, err)
        })

    }
        
    function getGamesFromGroupWithinRange(req, rsp){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
        //(mínimo e máximo) entre 0 e 100, sendo estes valores parametrizáveis no pedido. Os jogos 
        //vêm ordenadas por ordem decrescente da votação média
        const groupId = req.params.groupId
        const min = req.params.min
        const max = req.params.max

        services.getGamesFromGroupWithinRange(groupId, min, max).then(games => 
            rsp.json(games)
        ).catch(err => handleError(req, rsp, err))
        
    }

    async function handleError(req, rsp, err){
        switch(err){
            case "Resource not found":
                //status code 404
                sendNotFound(req, rsp,err)
                break
            case "Game already exists in this group":
                //409 Conflict
                sendConflict(req, rsp, err)
            case "Bad input":
            case "Missing arguments":
                //Bad request status code 400
                sendBadRequest(req, rsp, err)
                break
        }
    }

    function sendConflict(req, rsp, msg){
        rsp.status(409).json({
            error:msg,
            uri:req.originalUrl
        })
    }

    function sendNotFound(req, rsp, msg) {
        rsp.status(404).json({
            error:msg,
            uri:req.originalUrl
        })
    }

    function sendBadRequest(req, rsp, msg) {
        rsp.status(400).json({
            error:msg,
            uri:req.originalUrl
        })
    } 



    function sendGroupChangeSuccess(req, rsp, id, changeType, urlSuffix = "") {
        rsp.json({
          status : `Group with id ${id} ${changeType}`,
          uri: req.originalUrl + urlSuffix
        })
    }

    function sendGameChangeSuccess(req, rsp, gameId, groupId, changeType) {
        rsp.json({
          status : `Game with id ${gameId} ${changeType} in group with id ${groupId}`,
          uri: req.originalUrl
        })
    }
}