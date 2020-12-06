const frisby = require('frisby');
const serverBase = 'http://localhost:8000/covida/'
const Joi = frisby.Joi

test('verify groups server server is running', function () {
  return frisby.get(serverBase)
    .expect('status', 200);
});

describe('all groups', () => {
  test('should get all groups', () => {
    return frisby.get(`${serverBase}groups`)
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
  })
})


describe('specific groups', () => {
  test('should get a 404 for a non existing group', () => {
    return frisby.get(`${serverBase}groups/30`)
      .expect('status', 404)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'error': frisby.Joi.string().required(),
        'uri': `/covida/groups/30`,
      })
  })
})


describe('Add groups', () => {
  test('Add a non existing group', () => {
    return frisby.post(`${serverBase}groups`,{body :{name:"Sports",description:"Group of sports"}})
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Group with id 1 created',
        'uri': `/covida/groups`,
      })
  })
  test('Add an existing group', () => {
    return frisby.post(`${serverBase}groups`,{body :{name:"Sports",description:"Group of sports"}})
      .expect('status', 409)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Group already exists',
        'uri': `/covida/groups`,
      })
  })
})


describe('Edit groups', () => {
  test('Edit an existing group', () => {
    return frisby.put(`${serverBase}groups/1`,{body :{name:"ESports",description:"Group of Esports"}})
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Group with id 1 edited',
        'uri': `/covida/groups/1`,
      })
  })
  test('Edit an non existing group', () => {
    return frisby.put(`${serverBase}groups/2`,{body :{name:"Sports",description:"Group of sports"}})
      .expect('status', 404)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Resource not found',
        'uri': `/covida/groups/2`,
      })
  })
})

describe('Add games to group', () => {
  const gameId = 501
  const groupId = 1
  test('Add a game on a non existing group', () => {
    return frisby.put(`${serverBase}groups/2/games/${gameId}`)
      .expect('status', 404)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Resource not found',
        'uri': `/covida/groups/2/games/${gameId}`,
      })
  })
  test('Add a game on a existing group', () => {
    return frisby.put(`${serverBase}groups/${groupId}/games/${gameId}`)
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Game with id 501 added in group with id 1',
        'uri': `/covida/groups/${groupId}/games/${gameId}`,
      })
  })
})



describe('Remove games from group', () => {
  const gameId = 501
  const groupId = 1
  test('Remove a game from a non existing group', () => {
    return frisby.delete(`${serverBase}groups/2/games/${gameId}`)
      .expect('status', 404)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Resource not found',
        'uri': `/covida/groups/2/games/${gameId}`,
      })
  })
  test('Remove a game from a existing group', () => {
    return frisby.delete(`${serverBase}groups/${groupId}/games/${gameId}`)
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'status': 'Game with id 501 deleted in group with id 1',
        'uri': `/covida/groups/${groupId}/games/${gameId}`,
      })
  })
})