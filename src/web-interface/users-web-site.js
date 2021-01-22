const express = require("express")

module.exports = function (services) {
  if (!services) {
    throw "Invalid services object"
  }

  const router = express.Router()

  
  router.get("/login", loginGet)
  router.post('/login', validateLogin)
  router.get("/signUp", signUpGet)
  router.post("/signUp", createUser)
  router.put('/logout', logout)  
  router.put("/users/:usename", editUser)

  return router

  function loginGet(req, rsp) {
    rsp.render('login')
  }

  function signUpGet(req, rsp) {
    rsp.render('signUp')
  }

  function createUser(req, rsp) {
    services.createUser(req.body.username, req.body.password, req.body.retypedPassword).then(value => {
        req.login({ user: value._id }, (err) => rsp.redirect('/covida/site/groups'))
      }).catch(error => {
        rsp.render('signUp', {warning: error, username: req.body.username})
      })
      
  }

  function editUser(req, rsp) {
    let user = {id : req.body.id, username: req.body.username, password: req.body.password, groups: req.body.groups}
    services.editUser(user)
        //TODO 
        //processResponse is handled in another way
      .then(value => processResponse(null, value, rsp, 201))
        //TODO 
        //processResponse is handled in another way
      .catch(error => handleError(req,rsp,error))
  }

  function validateLogin(req, rsp) {
    const credentials = req.body
    
    services.validateLogin(credentials.username,credentials.password).then((status) => {
      if(status) {
        req.login({ user: credentials.username }, (err) => rsp.redirect('/covida/site/groups'))
      } else {
        rsp.render('login', {warning: "Login failed", username: credentials.username})
      }
    }).catch(err => {
      rsp.render('login', {warning: err, username: credentials.username})
    })
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