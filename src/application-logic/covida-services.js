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
        editUser,
        deleteUser
    }

    function getGameByName(name) {
        //Pesquisar jogos pelo nome
        return data.getGameByName(name)
    }


    function createGroup(groupName, description, userId) {
        if (!groupName || !description) {
            throw 'Missing arguments'
        } else if (groupName.trim().length <= 0 || description.trim().length <= 0) {
            throw 'Bad input'
        } else {
            return db.getUser(userId).then(user => {
                return db.createGroup(groupName, description).then(group => {
                    user.groups.push(group._id)
                    return db.editUser(user)
                })
            })
        }
    }

    function editGroup(userId, newGroup) {
        //Editar grupo, alterando o seu nome e descrição
        if (!newGroup.description || !newGroup.name) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(userId, newGroup.id).then(result => {
            return db.getGroupDetails(newGroup.id).then(group => {
                return db.editGroup(newGroup)
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
        
    }

    function deleteGroup(groupId, userId) {
        if (!groupId) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(userId, groupId).then(result => {
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
    }

    function getAllGroups() {
        //Listar todos os grupos
        return db.getAllGroups()
    }


    function getGroupDetails(userId, groupId) {
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if (!groupId) {
            throw 'Missing arguments'
        }
        return checkIfGroupBelongsToUser(userId, groupId).then(result => {
            return db.getGroupDetails(groupId)
        }).catch(err => {
            throw err
        })
    }

    function addGameToGroup(userId, groupId, gameId) {
        //Adicionar um jogo a um grupo
        if (!groupId || !gameId) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(userId, groupId).then(result => {
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

    function removeGameFromGroup(userId, groupId, gameId) {
        //Remover um jogo de um grupo
        if (!groupId || !gameId) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(userId, groupId).then(result => {
            return db.getGroupDetails(groupId).then(group => {
                return db.removeGameFromGroup(group, gameId)
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
        
    }

    function getGamesFromGroupWithinRange(userId, groupId, min, max) {
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 

        if (min > max || min <= 0 || max >= 100) {
            throw 'Bad input'
        }

        return checkIfGroupBelongsToUser(userId, groupId).then(result => {
            return db.getGroupDetails(groupId).then(group => {
                return db.getGamesFromGroupWithinRange(group, min, max)
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
        
    }

    function getUser(userId) {
        if (!userId)
            throw "Missing arguments"
        return db.getUser(userId)
    }

    function validateLogin(userId, password) {
        return getUser(userId).then(user => {
            if (user) {
                if (user.password == password)
                    return true
                else
                    return false
            }
        }).catch(err => {
            throw err
        })
    }

    function checkIfGroupBelongsToUser(userId, groupId) {
        return db.getUser(userId).then(user => {
            if (user.groups.find((id) => id == groupId)) {
                return true
            }
            throw "Resource not found"
        })
    }

    function createUser(username, password) {
        if (!username || !password) {
            throw 'Missing arguments'
        } else if (username.trim().length <= 0 || password.trim().length <= 0) {
            throw 'Bad input'
        } else {
            return db.getUser(username)
                .then(() => {
                    throw "User already exists"
                })
                .catch(() => {
                    return db.createUser(username, password)
                })
        }
    }

    function editUser(newUser) {
        //Editar user, possibilitando alterar a sua password e grupos
        if (!newUser.username || !newUser.password || !newUser.groups) {
             throw 'Missing arguments'
        }
        if (validateLogin(newUser.id, newUser.password)) {
            return db.getUser(newUser.id).then(user => {
                return db.editUser(newUser)
            }).catch(err => {
               throw err
            })
        }
    }

    function deleteUser(user) {
        if (!user.username || !user.password || !user.id) {
            throw 'Missing arguments'
        }

        if (validateLogin(user.id, user.password)) {
            return db.getUser(user.id).then(processDelete).catch(err => {
                throw err
            })
        }
    }

    async function processDelete(user){
        await Promise.all(user.groups.map(groupId => db.deleteGroup(groupId)))
        return db.deleteUser(user.id)
    }

}