
module.exports = function (router, services) {
  if (!services) {
    throw "Invalid services object"
  }


  router.post('/covida/login', validateLogin)
  router.put('/covida/logout', logout)
  router.use('/covida/auth', verifyAuthenticated)
  router.get("/covida/groups/new-group", createGroupForm)
  router.get("/covida/groups/:groupId", getGroupDetails)
  router.delete("/covida/groups/:groupId", deleteGroup)
  router.put("/covida/groups/:groupId", editGroup)
  router.post("/covida/groups", createGroup)
  router.get("/covida/groups", getAllGroups) //Remover?
//Fix uri e etc
  router.get("/covida/games/:gameName", getGameByName)
  router.put("/covida/groups/:id/games", addGameToGroup)
  router.delete("/covida/groups/:groupId/games/:gameId", removeGameFromGroup)
  router.get(`/covida/groups/:groupId/:min/:max`, getGamesFromGroupWithinRange)  
  router.post("/covida/users", createUser)
  router.delete("/covida/users/:userId", deleteUser)
  router.put("/covida/users/:userId", editUser)
  router.get("/covida/session",getSessionState) 
  router.get('/covida',apiCheck)


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

//TODO
//quando o grupo é criado, ou modificado de alguma forma, este tem de estar associado a um user, teremos de criar essa dependencia
function createGroup(req, rsp){
    //Criar grupo atribuindo-lhe um nome e descrição

    const group = { name: req.body.name, description: req.body.description }

    services.createGroup(group.name, group.description).then(result => {
        sendGroupChangeSuccess(req, rsp, result._id, result.result)
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

    services.deleteGroup(groupId).then((result) => {
        sendGroupChangeSuccess(req, rsp, result._id, result.result)}
    ).catch(err => 
        handleError(req, rsp, err)
    )
}

function getAllGroups(req,rsp){
    //Listar todos os grupos
    services.getAllGroups().then(groups => {
        rsp.json(groups)
    }).catch((err) => {
        handleError(req, rsp, err)
    })
    
}

function getGroupDetails(req, rsp){
    //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
    const groupId = req.params.groupId

    services.getGroupDetails(groupId).then(group => 
        rsp.json(group)
    ).catch(err => {
        handleError(req, rsp, err)
    }) 

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
    const groupId = req.params.groupId
    const min = req.params.min
    const max = req.params.max

    services.getGamesFromGroupWithinRange(groupId, min, max).then(games => 
        rsp.json(games)
    ).catch(err => handleError(req, rsp, err))
}

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

function verifyAuthenticated(req, rsp, next) {
  if (req.isAuthenticated())
    next()
  rsp.status(401).send("not authorized")
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

function getSessionState(req,rsp){
  //TODO 
  //processResponse is handled in another way
  processResponse(null,{status : req.isAuthenticated()},rsp,200)
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

function apiCheck(req, rsp) {
  rsp
    .status(200)
    .json({
    "name": "groups api",
    "version": "1.0.0",
    "description": "PI Groups API running"
    })
}

  return {

    serializeUser: function (user, done) {
      done(null, user.username)
    },

    deserializeUser: function (username, done) {
      done(null,{username})
    }
  }
}