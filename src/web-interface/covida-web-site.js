const express = require("express")

module.exports = function (services) {
  if (!services) {
    throw "Invalid services object"
  }

  const router = express.Router()


  router.get("/groups/:groupId", getGroupDetails) //done
  router.delete("/groups/:groupId", deleteGroup) //done
  router.put("/groups/:groupId", editGroup) //TODO
  router.post("/groups", createGroup) //done
  router.get("/groups", getAllUserGroups)  //done
  router.get("/games/:gameName", getGameByName) //input to url cannot add results to html
  router.put("/groups/:id/games/:gameId", addGameToGroup)
  router.get("/groups/:id/games", getGamesToGroup) //done
  router.delete("/groups/:groupId/games/:gameId", removeGameFromGroup) //TODO
  router.get(`/groups/:groupId/:min/:max`, getGamesFromGroupWithinRange)  //input to url cannot add results to html

  return router


  function getGameByName(req, rsp){
    //Pesquisar jogos pelo nome
    const name = req.params.gameName

    services.getGameByName(name).then((games) => {
        rsp.render("searchGames",{games:games})
    }).catch(err => {
        handleError(req, rsp, err)
    })
  }

  function getGamesToGroup(req, rsp){
    rsp.render("searchGames",{games : req.body})
  }

  function createGroup(req, rsp){
      //Criar grupo atribuindo-lhe um nome e descrição
      const group = { name: req.body.name, description: req.body.description }

      services.createGroup(group.name, group.description, req.user.username).then(result => {
        rsp.redirect('/covida/site/groups')
        //sendGroupChangeSuccess(req, rsp, result._id, result.result)
      }).catch(err => {
          handleError(req, rsp, err)
      })

  }

  function editGroup(req, rsp){
      //Editar grupo, alterando o seu nome e descrição
      const group = { id : req.params.groupId, name : req.body.name, description: req.body.description }

      services.editGroup(group).then((result) => {
          sendGroupChangeSuccess(req, rsp, result._id, result.result)
      }
      ).catch(err => 
          handleError(req, rsp, err)
      )
  }

  function deleteGroup(req, rsp){
      //Remover um grupo
      const groupId = req.params.groupId
      const user = req.user.username
      console.log("chegou ao delete")

      services.deleteGroup(groupId,user).then((result) => {
          sendGroupChangeSuccess(req, rsp, result._id, result.result)}
      ).catch(err => 
          handleError(req, rsp, err)
      )
  }

  function getAllUserGroups(req,rsp){
      //Listar todos os grupos

      services.getAllUserGroups(req.user.username).then(groups => {
          rsp.render('groups',{username: req.user.username, groups: groups})
      }).catch((err) => {
          if(err == "Resource not found"){
            rsp.render('groups',{username: req.user.username, title : "All groups", groups: []})
          }else{
            handleError(req, rsp, err)
          } 
      })
      
  }

  function getGroupDetails(req, rsp){
      //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
      const groupId = req.params.groupId
      const user = req.user.username
      
      services.getGroupDetails(user, groupId).then(group => 
          rsp.render('specificGroup',{ group: group })
      ).catch(err => {
          handleError(req, rsp, err)
      }) 

  }

  function addGameToGroup(req, rsp){
      //Adicionar um jogo a um grupo
      const gameId = req.params.gameId
      const groupId = req.params.groupId
      const user = req.user.username

      services.addGameToGroup(user ,groupId, gameId).then(() => {
          sendGameChangeSuccess(req, rsp, gameId, groupId, "added")}
      ).catch(err => {
          handleError(req, rsp, err)
      })
  }
      
  function removeGameFromGroup(req, rsp){
      //Remover um jogo de um grupo
      const gameId = req.params.gameId
      const groupId = req.params.groupId
      const user = req.user.username

      services.removeGameFromGroup(user ,groupId,gameId).then(() => {
          sendGameChangeSuccess(req, rsp, gameId, groupId, "deleted")}
      ).catch(err => {
          handleError(req, rsp, err)
      })
  }
      
  function getGamesFromGroupWithinRange(req, rsp){
      //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 
      const groupId = req.params.groupId
      const min = req.params.min
      const max = req.params.max
      const user = req.user.username

      services.getGamesFromGroupWithinRange(user,groupId, min, max).then(games => 
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
              break
          case "Bad input":
          case "Missing arguments":
              //Bad request status code 400
              sendBadRequest(req, rsp, err)
              break
          case "ECONNREFUSED":
              sendBadGateway(req, rsp, "Bad Gateway")
              break
      }
  }

  function sendBadGateway(req, rsp, msg){
      rsp.status(502).json({
          error:msg,
          uri:req.originalUrl
      })
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



  async function sendGroupChangeSuccess(req, rsp, id, changeType, urlSuffix = "") {
      rsp.json({
        status : `Group with id ${id} ${changeType}`,
        uri: req.originalUrl + urlSuffix
      })
  }

  async function sendGameChangeSuccess(req, rsp, gameId, groupId, changeType) {
      rsp.json({
        status : `Game with id ${gameId} ${changeType} in group with id ${groupId}`,
        uri: req.originalUrl
      })
  }

}