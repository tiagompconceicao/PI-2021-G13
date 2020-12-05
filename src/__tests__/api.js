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
      .expect('jsonTypes', '*', {
        'id': Joi.number().required(),
        'name': Joi.string().required(),
        'description': Joi.string()
      })
  })
})


describe('specific groups', () => {
  test('should get an existing group', () => {
    return frisby.get(`${serverBase}groups/1`)
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('jsonTypes', {
        'id': 1,
        'name': frisby.Joi.string().required(),
        'description': frisby.Joi.string()
      })
  })
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