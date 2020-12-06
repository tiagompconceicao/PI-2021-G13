
function getInitGroup(){ return  [{
  "name" : "Sports",
  "id" : 1,
  "description" : "grupo do grupo 13",
  "games" : [
      {
          "name" : "Doom",
          "id" : 7351,
          "total_rating" : 70
      }
  ]
}]
}

const igdbdata = require ('./../igdb-data')
const groupsDbFunction = require('./../covida-db')
const groupsServicesFunction = require('./../covida-services')

// TEST FOR ADDING GAMES
describe('Game creation', () => {
  let groupsDb = null
  let groupsServices = null
  const groupId = 1
  beforeEach(() => {
    groupsDb = groupsDbFunction(getInitGroup())
    groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Add an existing game', function (done) {
    const game = 7351
  
    groupsServices.addGameToGroup(groupId,game, (err) => {
      expect(err).toBeTruthy()
      groupsServices.getGroupDetails(groupId,(err,group) => { 
        expect(group.games.length).toBe(1)
        done()
      })
    })
  })

  test('Add a non existing game', function (done) {
    const game = 
  {
    id: 125
  }
      groupsServices.addGameToGroup(groupId,game.id, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(groupId,(err,group) => { 
          expect(group.games.length).toBe(2)
          done()
        })
      })
    })
  
  test('Add the same game twice', function (done) {
    const game = 
      {
        id: 125
      }
      groupsServices.addGameToGroup(groupId,game.id, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(groupId,(err,group) => { 
          expect(group.games.length).toBe(2)
          groupsServices.addGameToGroup(groupId,game.id, (err, data) => { 
            expect(err).toBeTruthy()
            groupsServices.getGroupDetails(groupId,(err,group) => { 
              expect(group.games.length).toBe(2)
              done()
            })
          })
        })
      })
    }) 
})

// TEST FOR CREATING GROUPS
describe('Group Creation', () => {   
  let groupsDb = null
  let groupsServices = null
  beforeEach(() => {
    groupsDb = groupsDbFunction(getInitGroup())
    groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Create an existing Group', function (done) {
    groupsServices.createGroup("Sports","ola", (err) => { 
      expect(err).toBeTruthy()
      groupsServices.getAllGroups((err,groups) => { 
        expect(groups.length).toBe(1)
        done()
      })
    })
  })


  test('Create a non existing group', function (done) {
      groupsServices.createGroup("Corridas","Description for group Corridas" , (err) => { 
        expect(err).toBeFalsy()
        groupsServices.getAllGroups((err,groups) => { 
          expect(groups.length).toBe(2)
          done()
        })
      })
    })
  
    test('Create the same group twice', function (done) {
      groupsServices.createGroup("xpto","Description for group Corridas" , (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getAllGroups((err,groups) => { 
          expect(groups.length).toBe(2)
          groupsServices.createGroup("xpto","Description for group Corridas" , (err, data) => { 
            expect(err).toBeTruthy()
            groupsServices.getAllGroups((err,groups) => { 
              expect(groups.length).toBe(2)
              done()
            })
          })
        })
      })
    }) 
})

// TEST FOR EDITING GROUPS
describe('Group Edition ', () => {
  let groupsDb = null
  let groupsServices = null
  beforeEach(() => {
  groupsDb = groupsDbFunction(getInitGroup())
  groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Edit an existing Group', function (done) {
    const group = 
  {
    id: 1,
    name: "ESports",
    description: "Description for ESports",
  }
    groupsServices.editGroup(group, (err) => { 
      expect(err).toBeFalsy()
      groupsServices.getGroupDetails(group.id, (err, editedGroup) => { 
        expect(editedGroup.description).toBe(group.description)
        done()
      })
    })
  })


  test('Edit a non existing group', function (done) {
    const group = 
    {
      id: 5,
      name: "Corridas",
      description: "Description for Corridas",
    }
      groupsServices.editGroup(group, (err) => { 
        expect(err).toBeTruthy()
        done()
      })
  })
})
// TESTS FOR GAME DELETION
describe('Game deletion', () => {
    let groupsDb = null
    let groupsServices = null
    const  groupId = 1
    const gameId = 7351
    beforeEach(() => {
      groupsDb = groupsDbFunction(getInitGroup())
      groupsServices = groupsServicesFunction(1,groupsDb)
    })

    test('delete an existing game', function (done) {
      groupsServices.removeGameFromGroup(groupId,gameId, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(groupId,(err,group) => { 
          expect(group.games.length).toBe(0)
          done()
        })
      })
    })
    
    test('delete a non existing game', function (done) {
        groupsServices.removeGameFromGroup(groupId,1244, (err, data) => { 
          expect(err).toBeTruthy()
          groupsServices.getGroupDetails(groupId,(err,group) => { 
            expect(group.games.length).toBe(1)
            done()
          })
        })
      })
    
      test('delete the same game twice', function (done) {
        groupsServices.removeGameFromGroup(groupId,gameId, (err, data) => { 
          expect(err).toBeFalsy()
          groupsServices.getGroupDetails(groupId,(err,group) => { 
            expect(group.games.length).toBe(0)
            groupsServices.removeGameFromGroup(groupId,gameId, (err, data) => { 
              expect(err).toBeTruthy()
              groupsServices.getGroupDetails(groupId,(err,group) => { 
                expect(group.games.length).toBe(0)
                done()
              })
            })
          })
        })
      }) 
})