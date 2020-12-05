const groupsDbFunction = require('../covida-db')
const groupsServicesFunction = require('../covida-services')

// TESTS FOR GAME DELETION
describe('Game deletion', () => {
    let groupsDb = null
    let groupsServices = null
    beforeEach(() => {
      groupsDb = groupsDbFunction
      groupsServices = groupsServicesFunction(groupsDb)
    })
    
    test('delete an existing game', function (done) {
      groupsServices.deleteGameFromGroup(1,1, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(1,group => { 
          expect(group.games.length).toBe(0)
          done()
        })
      })
    })


    test('delete a non existing game', function (done) {
        groupsServices.removeGameFromGroup(1,2, (err, data) => { 
          expect(err).toBeTruthy()
          groupsServices.getGroupDetails(1,group => { 
            expect(group.games.length).toBe(1)
            done()
          })
        })
      })
    
      test('delete the same game twice', function (done) {
        groupsServices.removeGameFromGroup(1,1, (err, data) => { 
          expect(err).toBeFalsy()
          groupsServices.getGroupDetails(1,group => { 
            expect(group.games.length).toBe(0)
            groupsServices.removeGameFromGroup(1,1, (err, data) => { 
              expect(err).toBeTruthy()
              groupsServices.getGroupDetails(1,group => { 
                expect(group.games.length).toBe(0)
                done()
              })
            })
          })
        })
      }) 
})

// TEST FOR ADDING GAMES
describe('Game creation', () => {
  let groupsDb = null
  let groupsServices = null
  const groupName = "Sports"
  beforeEach(() => {
    groupsDb = groupsDbFunction
    groupsServices = groupsServicesFunction(groupsDb)
  })
  
  test('Add an existing game', function (done) {
    const game = {
    id: 1,
    name: "Doom",
    description: "Description form diablo",
    total_rating: 70
    }

    groupsServices.addGameToGroup(1,game, (err, data) => { 
      expect(err).toBeTruthy()
      groupsServices.getGroupDetails(1,group => { 
        expect(group.games.length).toBe(1)
        done()
      })
    })
  })


  test('Add a non existing game', function (done) {
    const game = 
  {
    id: 2,
    name: "diablo",
    description: "Description form diablo",
    total_rating: 90
  }
      groupsServices.addGameToGroup(1,game, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(1,group => { 
          expect(group.games.length).toBe(2)
          done()
        })
      })
    })
  
    test('Add the same game twice', function (done) {
      const game = 
      {
        id: 2,
        name: "diablo",
        description: "Description form diablo",
        total_rating: 90
      }
      groupsServices.addGameToGroup(1,game, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(1,group => { 
          expect(group.games.length).toBe(2)
          groupsServices.addGameToGroup(1,game, (err, data) => { 
            expect(err).toBeTruthy()
            groupsServices.getGroupDetails(1,group => { 
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
    groupsDb = groupsDbFunction
    groupsServices = groupsServicesFunction(groupsDb)
  })
  
  test('Create an existing Group', function (done) {
    groupsServices.createGroup("Sports","Description for Sports", (err, data) => { 
      expect(err).toBeTruthy()
      groupsServices.getAllGroups(groups => { 
        expect(groups.length).toBe(1)
        done()
      })
    })
  })


  test('Create a non existing group', function (done) {
      groupsServices.createGroup("Corridas","Description for group Corridas" , (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getAllGroups(groups => { 
          expect(groups.length).toBe(2)
          done()
        })
      })
    })
  
    test('Create the same group twice', function (done) {
      groupsServices.createGroup("Corridas","Description for group Corridas" , (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getAllGroups(groups => { 
          expect(groups.length).toBe(2)
          groupsServices.createGroup("Corridas","Description for group Corridas" , (err, data) => { 
            expect(err).toBeTruthy()
            groupsServices.getAllGroups(groups => { 
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
  groupsDb = groupsDbFunction
  groupsServices = groupsServicesFunction(groupsDb)
  })
  
  test('Edit an existing Group', function (done) {
    const group = 
  {
    id: 1,
    name: "Sports",
    description: "New description for Sports",
  }
    groupsServices.editGroup(group, (err, data) => { 
      expect(err).toBeFalsy()
      groupsServices.getGroupDetails(group.id, editedGroup => { 
        expect(editedGroup.description).toBe(group.description)
        done()
      })
    })
  })


  test('Edit a non existing group', function (done) {
    const group = 
    {
      id: 2,
      name: "Corridas",
      description: "Description for Corridas",
    }
      groupsServices.editGroup(group, (err, data) => { 
        expect(err).toBeTruthy()
        done()
      })
    })
})