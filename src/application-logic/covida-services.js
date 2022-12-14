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
        getAllUserGroups,
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

    async function getGameByName(name) {
        //Pesquisar jogos pelo nome
        return data.getGameByName(name).then(games => {
            games.map(game => {
                if (game.total_rating)  game.total_rating = game.total_rating.toFixed(0)
            })
            return games  
        })
    }


    async function createGroup(groupName, description, username) {
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

    async function editGroup(username, newGroup) {
        //Editar grupo, alterando o seu nome e descrição
        if (!username || !newGroup.description || !newGroup.name || !newGroup.id) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(username, newGroup.id).then(result => {
            return db.getGroupDetails(newGroup.id).then(group => {
                group.name = newGroup.name
                group.description = newGroup. description
                return db.editGroup(group)
            }).catch(err => {
                throw err
            })
        }).catch(err => {
            throw err
        })
        
    }

    async function deleteGroup(groupId, username) {
        if (!groupId || !username) {
            throw 'Missing arguments'
        }

        return getUser(username).then(user => {
            return checkIfGroupBelongsToUser(username, groupId).then(() => {
                /*let newGroups = user.groups.filter(group => group.id != groupId)
                    if(newGroups.length != user.groups.length) {
                    user.groups = newGroups
                    } */
                return db.deleteGroup(groupId).then(group => {
                    return db.removeGroupFromUser(groupId,username)
                })
            }).catch(err => {
                throw err
            })   
        }).catch(err => {
            throw err
        })
                 
    }

    async function getAllGroups() {
        //Listar todos os grupos
        return db.getAllGroups()
    }

    async function getAllUserGroups(username){
        if(!username){
            throw "Missing arguments"
        }
        return db.getUser(username).then(processGroups).catch(err => {throw err}) 
    }

    async function processGroups(user){

        return Promise.all(user.groups.map(groupId => db.getGroupDetails(groupId)))

    }

    async function getGroupDetails(username, groupId) {
        //Obter os detalhes de um grupo, com o seu nome, descrição e nomes dos jogos que o constituem
        if (!username || !groupId) {
            throw 'Missing arguments'
        }
        return checkIfGroupBelongsToUser(username, groupId).then(result => {
            return db.getGroupDetails(groupId).then(group => {
                group.games.map(game => game.total_rating = game.total_rating.toFixed(0))
                return group  
            })
        }).catch(err => {
            throw err
        })
    }

    async function addGameToGroup(username, groupId, gameId) {
        //Adicionar um jogo a um grupo
        if (!username || !groupId || !gameId) {
            throw 'Missing arguments'
        }

        return checkIfGroupBelongsToUser(username, groupId).then(result => {
            return db.getGroupDetails(groupId).then(group => {
                const game = group.games.find(game => game.id == gameId)
                if (game) {
                    throw "Game already exists in this group"
                }
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
        
    }

    async function removeGameFromGroup(username, groupId, gameId) {
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

    async function getGamesFromGroupWithinRange(username, groupId, min, max) {
        //Obter os jogos de um grupo que têm uma votação média (total_rating) entre dois valores 

        if (min > max || min < 0 || max > 100) {
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

    async function getUser(username) {
        if (!username)
            throw "Missing arguments"
        return db.getUser(username)
    }

    async function verifyIfUserExists(username){
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

    async function validateLogin(username, password) {
        if(!username || !password) {
            throw 'Please insert username and password'
        } 
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

    async function checkIfGroupBelongsToUser(username, groupId) {
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

    async function editUser(newUser) {
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