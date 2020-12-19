
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
//const groupsElasticFunction = require('./../covida-db-elastic')
const groupsDbFunction = require('./../covida-db')
const groupsServicesFunction = require('./../covida-services')

describe('Game creation', () => {
  let groupsDb = null
  let groupsServices = null
  const groupId = 1
  beforeEach(() => {
    groupsDb = groupsDbFunction(getInitGroup())
    groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Add an existing game', function (done) {
    const gameId = 7351
  
    groupsServices.addGameToGroup(groupId,gameId).catch((err) => {
      expect(err).toBeTruthy()
      groupsServices.getGroupDetails(groupId).then((group)=>{
        expect(group.games.length).toBe(1)
        done()
      })
    })
  })


  test('Add a non existing game', function (done) {
    const gameId = 125 

    groupsServices.addGameToGroup(groupId,gameId).then(() => {
      groupsServices.getGroupDetails(groupId).then((group)=>{
        expect(group.games.length).toBe(2)
        done()
      })
    })
  })
  
  test('Add the same game twice', function (done) {

    const gameId = 125 

    groupsServices.addGameToGroup(groupId,gameId).then(() => {
      groupsServices.getGroupDetails(groupId).then((group)=>{
        expect(group.games.length).toBe(2)
        groupsServices.addGameToGroup(groupId,gameId).catch((err) => {
          expect(err).toBeTruthy()
          groupsServices.getGroupDetails(groupId).then((group)=>{
            expect(group.games.length).toBe(2)
            done()
          })
        })
      })
    })
  }) 
})

describe('Group Creation', () => {   
  let groupsDb = null
  let groupsServices = null
  beforeEach(() => {
    groupsDb = groupsDbFunction(getInitGroup())
    groupsServices = groupsServicesFunction(igdbdata,groupsDb)
  })
  
  test('Create an existing Group', function (done) {
    groupsServices.createGroup("Sports","Sports description").then(()=>{
      groupsServices.getAllGroups().then((groups) =>{
        expect(groups.length).toBe(2)
        done()
      })
    })
  })


  test('Create a non existing group', function (done) {
    groupsServices.createGroup("Races","Races description").then(()=>{
      groupsServices.getAllGroups().then((groups) =>{
        expect(groups.length).toBe(2)
        done()
      })
    })
  })

  test('Create a group without name', function (done) {
    groupsServices.createGroup(null,"Races description").catch((err)=>{
      expect(err).toBeTruthy()
      groupsServices.getAllGroups().then((groups) =>{
        expect(groups.length).toBe(1)
        done()
      })
    })
  })

  test('Create a group without description', function (done) {
    groupsServices.createGroup("Races",null).catch((err)=>{
      expect(err).toBeTruthy()
      groupsServices.getAllGroups().then((groups) =>{
        expect(groups.length).toBe(1)
        done()
      })
    })
  })

  test('Create a group with blank name', function (done) {
    groupsServices.createGroup("    ","Races description").catch((err)=>{
      expect(err).toBeTruthy()
      groupsServices.getAllGroups().then((groups) =>{
        expect(groups.length).toBe(1)
        done()
      })
    })
  })

  test('Create a group with blank description', function (done) {
    groupsServices.createGroup("Races","    ").catch((err)=>{
      expect(err).toBeTruthy()
      groupsServices.getAllGroups().then((groups) =>{
        expect(groups.length).toBe(1)
        done()
      })
    })
  })   
})

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
    groupsServices.editGroup(group).then(() => {
      groupsServices.getGroupDetails(group.id).then((editedGroup)=>{
        expect(editedGroup.name).toBe(group.name)
        expect(editedGroup.description).toBe(group.description)
        done()
      }) 
    }) 
  })

  test('Edit name of an existing Group', function (done) {
    const group = 
  {
    id: 1,
    name: "ESports"
  }

    groupsServices.editGroup(group).then(() => {
      groupsServices.getGroupDetails(group.id).then((editedGroup)=>{
        expect(editedGroup.name).toBe(group.name)
        expect(editedGroup.description).toBeTruthy()
        done()
      }) 
    }) 
  })

  test('Edit description of an existing Group', function (done) {
    const group = 
  {
    id: 1,
    description: "Description for ESports"
  }

    groupsServices.editGroup(group).then(() => {
      groupsServices.getGroupDetails(group.id).then((editedGroup)=>{
        expect(editedGroup.description).toBe(group.description)
        expect(editedGroup.name).toBeTruthy()
        done()
      }) 
    }) 
  })


  test('Edit a non existing group', function (done) {
    const group = {
      id: 5,
      name: "Corridas",
      description: "Description for Corridas",
    }

    groupsServices.editGroup(group).catch((err) => {
      expect(err).toBeTruthy()
      done()
    })
  })
})

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
    groupsServices.removeGameFromGroup(groupId,gameId).then(() => {
      groupsServices.getGroupDetails(groupId).then((group)=>{
        expect(group.games.length).toBe(0)
        done()
      })
    })
  })
    
  test('delete a non existing game', function (done) {
    groupsServices.removeGameFromGroup(groupId,1244).catch((err) => {
      expect(err).toBeTruthy()
      groupsServices.getGroupDetails(groupId).then((group) => {
        expect(group.games.length).toBe(1)
        done()
      })
    })
  })

  test('delete the same game twice', function (done) {
    groupsServices.removeGameFromGroup(groupId,gameId).then(() => {
      groupsServices.getGroupDetails(groupId).then((group)=>{
        expect(group.games.length).toBe(0)
        groupsServices.removeGameFromGroup(groupId,1244).catch((err) => {
          expect(err).toBeTruthy()
          groupsServices.getGroupDetails(groupId).then((group) => {
            expect(group.games.length).toBe(0)
            done()
          })
        })
      })
    })
  }) 
})
