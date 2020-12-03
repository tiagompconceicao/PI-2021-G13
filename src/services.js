
const groupsDbFunction = require('../covida-db')
const groupsServicesFunction = require('../covida-services')

/*
describe('Group deletion', () => {
    let groupsDb = null
    let groupsServices = null
    beforeEach(() => {
      groupsDb = groupsDbFunction(require('./initialGroups'))
      groupsServices = groupsServicesFunction(groupsDb)
    })
    
    test('delete an existing task', function (done) {
      groupsServices.deleteGroup(1, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getAllGroups(tasks => { 
          expect(groups.length).toBe(0)
          done()
        })
      })
    })
})
*/

describe('Game deletion', () => {
    let groupsDb = null
    let groupsServices = null
    beforeEach(() => {
      groupsDb = groupsDbFunction(require('./initialGroups'))
      groupsServices = groupsServicesFunction(groupsDb)
    })
    
    test('delete an existing game', function (done) {
      groupsServices.deleteGameFromGroup(groupName,gameName, (err, data) => { 
        expect(err).toBeFalsy()
        groupsServices.getGroupDetails(groupName,group => { 
          expect(group.length).toBe(0)
          done()
        })
      })
    })


    test('delete a non existing game', function (done) {
        groupsServices.removeGameFromGroup(GroupName,gameName, (err, data) => { 
          expect(err).toBeTruthy()
          groupsServices.getGroupDetails(groupName,group => { 
            expect(group.length).toBe(1)
            done()
          })
        })
      })
    
      test('delete the same game twice', function (done) {
        groupsServices.removeGameFromGroup(GroupName,gameName, (err, data) => { 
          expect(err).toBeFalsy()
          groupsServices.getGroupDetails(GroupName,group => { 
            expect(group.games.length).toBe(0)
            groupsServices.removeGameFromGroup(GroupName,gameName, (err, data) => { 
              expect(err).toBeTruthy()
              groupsServices.getGroupDetails(GroupName,group => { 
                expect(group.games.length).toBe(0)
                done()
              })
            })
          })
        })
      }) 
})