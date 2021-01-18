const express = require("express")

module.exports = function (covidaServices) {
  if (!covidaServices) {
    throw "Invalid CovidaServices object"
  }

  const router = express.Router()

  router.get("/groups", getAllGroups)
  router.get("/groups/new-task", createGroupForm)
  router.get("/groups/:id", getGroupDetails)
  router.delete("/groups/:id", deleteGroup)
  router.put("/groups/:id", editGroup)
  router.post("/groups", createGroup)
  return router

  function getAllGroups(req, rsp) {
    covidaServices.getAllGroups(() => rsp.render('groups', { title : "All groups", groups: groups}))
  }

  function getGroupDetails(req, rsp) {
    covidaServices.getGroup(req.params.id)
    /*function processGetTask(err, task) {
      if (err) {
        sendNotFound(req, rsp)
      }

      rsp.json(task)
    }*/
  }

  function deleteGroup(req, rsp) {
    const id = req.params.id

    covidaServices.deleteGroup(req.params.id)

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

    covidaServices.editGroup(group)

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
    covidaServices.createGroup(group.groupName, group.description)
    
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