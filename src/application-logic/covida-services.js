module.exports = function (data, db) {
    if (!data) {
        throw 'Invalid data object'
    }
    if (!db) {
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
        editUser
    }

    function getGameByName(name) {
        //Pesquisar jogos pelo nome
        return data.getGameByName(name)
    }


    function createGroup(groupName, description, username) {
        if (!groupName || !description) {
            throw 'Missing arguments'
        } else if (groupName.trim().length <= 0 || description.trim().length <= 0) {
            throw 'Bad input'
        } else {
            return db.getUser(username).then(user => {
                return db.createGroup(groupName, description).then(group => {
                    user.groups.push(group._id)
                    return db.editUser(user)
                })
            })
        }
    }

    function editGroup(username, newGroup) {
        //Editar grupo, alterando o seu nome e descrição
        if (!newGroup.description || !newGroup.name) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(username, newGroup.id).then(result => {
            return db.getGroupDetails(newGroup.id).then(group => {
                return db.editGroup(newGroup)
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
        
    }

    function deleteGroup(groupId, username) {
        if (!groupId) {
            throw 'Missing arguments'
        }

        return getUser(username).then(user => {
            return checkIfGroupBelongsToUser(username, groupId).then(() => {
                let newGroups = user.groups.filter(group => group.id != groupId)
                    if(newGroups.length != user.groups.length) {
                    user.groups = newGroups
                    } 
                return db.deleteGroup(groupId).then(group => {
                    return db.editUser(user)
                })
            }).catch(err => {
                throw err
            })   
        }).catch(err => {
            throw err
        })
                 
    }

    function getAllGroups(username) {
        //Listar todos os grupos
        //Apenas pode procurar os grupos de um determinado user
        //FIX!!
        return db.getAllGroups(username)
    }


    function getGroupDetails(username, groupId) {
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if (!groupId) {
            throw 'Missing arguments'
        }
        return checkIfGroupBelongsToUser(username, groupId).then(result => {
            return db.getGroupDetails(groupId)
        }).catch(err => {
            throw err
        })
    }

    function addGameToGroup(username, groupId, gameId) {
        //Adicionar um jogo a um grupo
        if (!groupId || !gameId) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(username, groupId).then(result => {
            return db.getGroupDetails(groupId).then(group => {
                return db.verifyIfGameExistsInGroup(group, gameId).then(() => {
                    return data.getGameById(gameId).then(data => {
                        if (data == null) {
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
        }).catch(err => {
            throw err
        })
        
    }

    function removeGameFromGroup(username, groupId, gameId) {
        //Remover um jogo de um grupo
        if (!groupId || !gameId) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(username, groupId).then(result => {
            return db.getGroupDetails(groupId).then(group => {
                return db.removeGameFromGroup(group, gameId)
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
        
    }

    function getGamesFromGroupWithinRange(username, groupId, min, max) {
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 

        if (min > max || min <= 0 || max >= 100) {
            throw 'Bad input'
        }

        return checkIfGroupBelongsToUser(username, groupId).then(result => {
            return db.getGroupDetails(groupId).then(group => {
                return db.getGamesFromGroupWithinRange(group, min, max)
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
        
    }

    function getUser(username) {
        if (!username)
            throw "Missing arguments"
        return db.getUser(username)
    }

    function verifyIfUserExists(username){
        if (!username)
            throw "Missing arguments"
        return db.getUser(username).then(() => {return true})
        .catch((err) => {
            if (err == "Resource not found") {
                return false;
            }
            throw err;
        })
    }

    function validateLogin(username, password) {
        return getUser(username).then(user => {
            if (user) {
                if (user.password == password){
                    return true
                } else {
                    return false
                }     
            }
        }).catch(err => {
            throw err
        })
    }

    function checkIfGroupBelongsToUser(username, groupId) {
        return db.getUser(username).then(user => {
            if (user.groups.find((id) => id == groupId)) {
                return true
            }
            throw "Resource not found"
        })
    }

    async function createUser(username, password, retypedPassword) {
        if (!username || !password) {
            throw 'Missing arguments'
        } else if (password != retypedPassword) {
            throw "Passwords does not matches"
        } else if (username.trim().length <= 0 || password.trim().length <= 0) {
            throw 'Bad input'
        } else {
            return verifyIfUserExists(username).then((exists) => {
                if(!exists) {
                    return db.createUser(username, password)
                } else {
                    throw "User already exists"
                }  
            }).catch(err => {
                throw err
            })
        }
    }

    function editUser(newUser) {
        //Editar user, possibilitando alterar a sua password e grupos
        if (!newUser.username || !newUser.password || !newUser.groups) {
             throw 'Missing arguments'
        }
        if (validateLogin(newUser.username, newUser.password)) {
            return db.getUser(newUser.username).then(user => {
                return db.editUser(newUser)
            }).catch(err => {
               throw err
            })
        }
    }

}