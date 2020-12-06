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