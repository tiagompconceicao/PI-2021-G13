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
        editUser,
        deleteUser
    }

    function getGameByName(name){
        //Pesquisar jogos pelo nome
        return data.getGameByName(name)
    }

    //TODO
    //quando o grupo é criado, ou modificado de alguma forma, este tem de estar associado a um user, teremos de criar essa dependencia
    function createGroup(groupName, description){
        if(!groupName || !description){
            throw 'Missing arguments'
        } else if (groupName.trim().length <= 0 || description.trim().length <= 0 ){
            throw 'Bad input'
        } else {
            //Verificar se o username existe
            return db.createGroup(groupName, description)
            //Adicionar group id ao array de grupos do user
        }
    }
        
    function editGroup(newGroup){
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

    function deleteGroup(groupId){
        if(!groupId){
            throw 'Missing arguments'
        }

        return db.getGroupDetails(groupId).then(group => {
            //verificar se groupId existe no array de groups do username
            return db.deleteGroup(group.id)
            //Remover groupId do array em username
            
        }).catch( err => {
            throw err
        }) 
    }

    function getAllGroups(){
        //Listar todos os grupos
        return db.getAllGroups()
    }
        
    
    function getGroupDetails(groupId){
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if(!groupId){
            throw 'Missing arguments'
        }
        
        return db.getGroupDetails(groupId)
    }
        
    function addGameToGroup(groupId, gameId){
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
        
    function removeGameFromGroup(groupId, gameId){
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
        
    function getGamesFromGroupWithinRange(groupId, min, max){
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
      if(!username)
      throw "Missing arguments"
    return db.getUser(username)
  }

  function validateLogin(username, password) {
    return getUser(username)
    .then(user => {
        if(user){
            if(user.password == password)
            return true
            else 
            return false
        }
    })
    .catch(err =>{
        throw err
    })
  }

  function checkIfGroupBelongsToUser(username, groupId) {
    return db.getUser(username)
      .then(user => {
        if (user.groups.find((id) => id == groupId)) {
          return true
        }
        throw "Resource not found"
      })
  }

  function createUser(username, password){
    if(!username || !password){
        throw 'Missing arguments'
    } else if (username.trim().length <= 0 || password.trim().length <= 0 ){
        throw 'Bad input'
    } else {
        return db.getUser(username)
        .then( () =>{
            throw "User already exists"
        })
        .catch ( () => {
            return db.createUser(username, password) 
        })
    }
  }

  function editUser(newUser){
      //Editar grupo, alterando o seu nome e descrição
      if(!newUser.username || !newUser.password || !newUser.groups){
        throw 'Missing arguments'
    }

    return db.getUser(newUser.username).then(user => {
        return db.editUser(newUser)
    }).catch( err => {
        throw err
    })  
  }

  function deleteUser(username){
    if(!username){
        throw 'Missing arguments'
    }

    return db.getGroupDetails(username).then(user => {
        return db.deleteGroup(username)
    }).catch( err => {
        throw err
    }) 
  }
  
}