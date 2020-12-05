const initGroup =[{
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

const igdbdataFunction = require ('./../igdb-data')
const groupsDbFunction = require('./../covida-db')
const groupsServicesFunction = require('./../covida-services')

// TEST FOR ADDING GAMES
describe('Game creation', () => {
  let igdbdata = null
  let groupsDb = null
  let groupsServices = null
  const groupId = 1
  beforeEach(() => {
    igdbdata = igdbdataFunction
    groupsDb = groupsDbFunction(initGroup)
    groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Add an existing game', function (done) {
    const game = 7351
  
    groupsServices.addGameToGroup(groupId,game, (err) => { ~
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
    id: 125,
    name: "diablo",
    description: "Description form diablo",
    total_rating: 90
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
        id: 123,
        name: "World of Warcraft",
        description: "Description form World of Warcraft",
        total_rating: 90
      }
      groupsServices.addGameToGroup(groupId,game.id, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(groupId,(err,group) => { 
          expect(group.games.length).toBe(3)
          groupsServices.addGameToGroup(groupId,game.id, (err, data) => { 
            expect(err).toBeTruthy()
            groupsServices.getGroupDetails(groupId,(err,group) => { 
              expect(group.games.length).toBe(3)
              done()
            })
          })
        })
      })
    }) 
})

// TEST FOR CREATING GROUPS
describe('Group Creation', () => {   
  let igdbdata = null
  let groupsDb = null
  let groupsServices = null
  beforeEach(() => {
    igdbdata = igdbdataFunction
    groupsDb = groupsDbFunction(initGroup)
    groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Create an existing Group', function (done) {
    groupsServices.createGroup("Sports","ola", (err) => { 
      expect(err).toBeTruthy()
      groupsServices.getAllGroups( groups => { 
        expect(groups.length).toBe(1)
        done()
      })
    })
  })


  test('Create a non existing group', function (done) {
      groupsServices.createGroup("Corridas","Description for group Corridas" , (err) => { 
        expect(err).toBeFalsy()
        groupsServices.getAllGroups(groups => { 
          expect(groups.length).toBe(2)
          done()
        })
      })
    })
  
    test('Create the same group twice', function (done) {
      groupsServices.createGroup("xpto","Description for group Corridas" , (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getAllGroups(groups => { 
          expect(groups.length).toBe(3)
          groupsServices.createGroup("xpto","Description for group Corridas" , (err, data) => { 
            expect(err).toBeTruthy()
            groupsServices.getAllGroups(groups => { 
              expect(groups.length).toBe(3)
              done()
            })
          })
        })
      })
    }) 
})

// TEST FOR EDITING GROUPS
describe('Group Edition ', () => {
  let igdbdata = null
  let groupsDb = null
  let groupsServices = null
  beforeEach(() => {
  igdbdata = igdbdataFunction
  groupsDb = groupsDbFunction(initGroup)
  groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Edit an existing Group', function (done) {
    const group = 
  {
    id: 1,
    name: "Sports",
    description: "Description for Sports",
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
      groupsDb = groupsDbFunction(initGroup)
      groupsServices = groupsServicesFunction(1,groupsDb)
    })

    test('delete an existing game', function (done) {
      groupsServices.removeGameFromGroup(groupId,gameId, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(groupId,(err,group) => { 
          expect(group.games.length).toBe(2)
          done()
        })
      })
    })
    
    test('delete a non existing game', function (done) {
        groupsServices.removeGameFromGroup(groupId,1244, (err, data) => { 
          expect(err).toBeTruthy()
          groupsServices.getGroupDetails(groupId,(err,group) => { 
            expect(group.games.length).toBe(2)
            done()
          })
        })
      })
    
      test('delete the same game twice', function (done) {
        groupsServices.removeGameFromGroup(groupId,123, (err, data) => { 
          expect(err).toBeFalsy()
          groupsServices.getGroupDetails(groupId,(err,group) => { 
            expect(group.games.length).toBe(1)
            groupsServices.removeGameFromGroup(groupId,123, (err, data) => { 
              expect(err).toBeTruthy()
              groupsServices.getGroupDetails(groupId,(err,group) => { 
                expect(group.games.length).toBe(1)
                done()
              })
            })
          })
        })
      }) 
})