const express = require("express")

module.exports = function (services) {
  if (!services) {
    throw "Invalid services object"
  }

  const router = express.Router()

  router.post('/login', validateLogin)
  router.put('/logout', logout)  
  router.post("/users", createUser)
  router.delete("/users/:userId", deleteUser)
  router.put("/users/:userId", editUser)

  return router

  function createUser(req, rsp) {
    services.createUser(req.body.username, req.body.password)
        //TODO 
        //processResponse is handled in another way
      .then(value => processResponse(null, value, rsp, 201))
        //TODO 
        //processResponse is handled in another way
      .catch(error => processResponse(error, null, rsp))
  }

  function editUser(req, rsp) {
    let user = {id : req.body.id, username: req.body.username, password: req.body.password, groups: req.body.groups}
    services.editUser(user)
        //TODO 
        //processResponse is handled in another way
      .then(value => processResponse(null, value, rsp, 201))
        //TODO 
        //processResponse is handled in another way
      .catch(error => processResponse(error, null, rsp))
  }

  function deleteUser(req, rsp) {
    let user = {id : req.body.id, username: req.body.username, password: req.body.password, groups: req.body.groups}
    ciborgService.deleteUser(user)
      .then(value => {
        if (req.user && req.user.username == req.body.username) req.logout()
        //TODO 
        //processResponse is handled in another way
        processResponse(null, value, rsp)
      })
      //TODO 
      //processResponse is handled in another way
      .catch(error => processResponse(error, null, rsp))
  }




  function validateLogin(req, rsp) {
    if (!req.user || !req.user.username) {
      return services.validateLogin(req.body.username, req.body.password)
        .then((isValid) => {
          if (isValid) {
            req.login({ username: req.body.username }, (err => {
              if (err) {
                //TODO 
                //error not handled with these
                throw responseMapper.Unauthorized
              }
              //TODO 
              //processResponse is handled in another way
              return processResponse(null, { status: "Authenticated" }, rsp)
            }
            ))
          } else {
            //TODO 
            //error not handled with these
            throw responseMapper.Unauthorized
          }
        })
        //TODO 
        //processResponse is handled in another way
        .catch(error => processResponse(error, null, rsp))
    }
    //TODO 
    //processResponse is handled in another way
    processResponse(responseMapper.Forbidden, null, rsp)
  }

  function logout(req, rsp) {
    req.logout()
    rsp.redirect('/home')
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