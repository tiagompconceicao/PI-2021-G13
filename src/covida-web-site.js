const express = require("express")

module.exports = function (services) {
  if (!services) {
    throw "Invalid services object"
  }

  const router = express.Router()

  router.use('/auth', verifyAuthenticated)
  router.get("/groups", getAllGroups)
  router.get("/groups/new-group", createGroupForm)
  router.get("/groups/:groupId", getGroupDetails)
  router.delete("/groups/:groupId", deleteGroup)
  router.put("/groups/:groupId", editGroup)
  router.post("/groups", createGroup)

  router.get("/games/:gameName", getGameByName)
  router.post('/login', validateLogin)
  router.put('/auth/logout', logout)
  router.get("/auth/groups/:id", getGroupDetail)
  router.put("/auth/groups/:id/games", putGameInGroup)
  router.delete("/auth/groups/:id/games/:idGame", deleteGameInGroup)
  router.get("/auth/groups/:id/games", getGamesInGroupWithinTime)
  router.post("/users", createUser)
  router.delete("/users/:userId", deleteUser)
  router.put("/users/:userId", editUser)
  router.get("/session",getSessionState)


  function getAllGroups(req, rsp) {
    services.getAllGroups(() => rsp.render('groups', { title : "All groups", groups: groups}))
  }

  function getGroupDetails(req, rsp) {
    services.getGroup(req.params.id)
    /*function processGetTask(err, task) {
      if (err) {
        sendNotFound(req, rsp)
      }

      rsp.json(task)
    }*/
  }

  function deleteGroup(req, rsp) {
    const id = req.params.id

    services.deleteGroup(req.params.id)

    /*function processDeleteTask(err, task) {
      if (err) {
        sendNotFound(req, rsp)
      }
      sendChangeSuccess(req, rsp, id, "deleted")
    }*/
  }

  function editGroup(req, rsp) {
    const id = req.params.id
    const group = req.body
    group.id = id

    services.editGroup(group)

    /*function processUpdateTask(err, task) {
      if (err) {
        return sendNotFound(req, rsp)
      }
      sendChangeSuccess(req, rsp, id, "updated")
    }*/
  }


  function createGroupForm(req, rsp) {
    rsp.render('new-group', {title: "Create a new group"})
  }

  function createGroup(req, rsp) {
    
    const group = { groupName: req.body.name, description: req.body.description }

    console.log("#######", group)
    services.createGroup(group.groupName, group.description)
    
    /*function processCreateTask(err, task) {
      console.log("##", task)
      if (err) {
        return sendNotFound(req, rsp)
      }
      rsp.redirect('/site/groups')
    }*/
  }

  function Error(msg, uri) {
    this.error = msg
    this.uri = uri
  }

  function sendNotFound(req, rsp) {
    rsp.status(404).json(new Error("Resource not found", req.originalUrl))
  }

  function sendChangeSuccess(req, rsp, id, changeType, urlSuffix = "") {
    rsp.json({
      status: `task wit id ${id} ${changeType}`,
      uri: req.originalUrl + urlSuffix,
    })
  }
}