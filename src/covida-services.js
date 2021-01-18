const covidaDb = require("./covida-db")


module.exports = function(data,db) {
    if(!data){
        throw 'Invalid data object'
    }
    if(!db){
        throw 'Invalid db object'
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
        getGamesFromGroupWithinRange,
        getUser,
        validateLogin,
        checkIfGroupBelongsToUser,
        createUser,
        deleteUser,
    }

    async function getGameByName(name){
        //Pesquisar jogos pelo nome
        return data.getGameByName(name)
    }

    //TODO
    //quando o grupo é criado, ou modificado de alguma forma, este tem de estar associado a um user, teremos de criar essa dependencia
    async function createGroup(groupName, description){
        //TODO: Verificar se não é passado espaços em branco
        if(!groupName || !description){
            throw 'Missing arguments'
        } else if (groupName.trim().length <= 0 || description.trim().length <= 0 ){
            throw 'Bad input'
        } else {
            return db.createGroup(groupName, description) 
        }
    }
        
    async function editGroup(newGroup){
        //Editar grupo, alterando o seu nome e descrição
        if(!newGroup.description && !newGroup.name){
            throw 'Missing arguments'
        }

        return db.getGroupDetails(newGroup.id).then(group => {
            return db.editGroup(newGroup)
        }).catch( err => {
            throw err
        }) 
        
    }

    async function deleteGroup(groupId){
        if(!groupId){
            throw 'Missing arguments'
        }

        return db.getGroupDetails(groupId).then(group => {
            return db.deleteGroup(group.id)
        }).catch( err => {
            throw err
        }) 
    }

    async function getAllGroups(){
        //Listar todos os grupos
        return db.getAllGroups()
    }
        
    
    async function getGroupDetails(groupId){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if(!groupId){
            throw 'Missing arguments'
        }
        
        return db.getGroupDetails(groupId)
    }
        
    async function addGameToGroup(groupId, gameId){
        //Adicionar um jogo a um grupo
        if(!groupId || !gameId){
            throw 'Missing arguments'
        }

        return db.getGroupDetails(groupId).then(group => {
            return db.verifyIfGameExistsInGroup(group,gameId).then(() => {
                return data.getGameById(gameId).then(data => {
                    if(data == null) {
                        throw "Resource not found"
                    } else {
                        return db.addGameToGroup(group, data)
                    }
                }).catch(err => {
                    throw err
                })
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
    }
        
    async function removeGameFromGroup(groupId, gameId){
        //Remover um jogo de um grupo
        if(!groupId || !gameId){
            throw 'Missing arguments'
        }

        return db.getGroupDetails(groupId).then(group => {
            return db.removeGameFromGroup(group, gameId)
        }).catch(err => {
            throw err
        })
    }
        
    async function getGamesFromGroupWithinRange(groupId, min, max){
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 

        if(min > max || min <= 0 || max >= 100){
            throw 'Bad input'
        }

        return db.getGroupDetails(groupId).then( group => {
            return db.getGamesFromGroupWithinRange(group, min, max)
        }).catch(err => {
            throw err
        })
    }



  function getUser(username){
    return covidaDb.getUser(username)
  }

  function validateLogin(username, password) {
    return covidaDb.validateLogin(username, password)
  }

  function checkIfGroupBelongsToUser(username, groupId) {
    return covidaDb.getUser(username)
      .then(user => {
        if (user.groups.find((id) => id == groupId)) {
          return true
        }
        //TODO
        //error handling not done with these
        throw responseMapper.NoSuchResource("Group")
      })
  }

  function createUser(username, password) {
      //TODO 
      //Responses not handled with these
    return responseMapper
      .validateParameter(username, (name) => name, "username")
      .then(() => responseMapper.validateParameter(password, (password) => password, "password"))
      .then(() => covidaDb.userExists(username))
      .then(exists => {
        if (!exists) {
          return covidaDb.createUser(username, password)
        } else {
            //TODO
            //error handling not done with these
          throw responseMapper.UserAlreadyExists(username)
        }
      })
  }

  function deleteUser(username, password) {
      //TODO 
      //Responses not handled with these
    return responseMapper
      .validateParameter(username, (name) => name, "username")
      .then(() => responseMapper.validateParameter(password, (password) => password, "password"))
      .then(() => covidaDb.getUser(username))
      .then((user) => {
          if(user.username == username && user.password == password){
              return covidaDb.deleteUser(username,password)
          }
            //TODO
            //error handling not done with these
          else throw responseMapper.Unauthorized

      })
  }
}