const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Session Controller', () => {
  let ong;
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    ong = await request(app)
      .post('/ongs')
      .send({
        name: "APAD2",
        email: "contato@teste.com",
        whatsapp: "+55 (99) 99999-9999",
        city: "Rio de Janeiro",
        uf: "RJ"
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should return 404 if ONG doesn\'t exist', async () => {
    const response = await request(app).post('/sessions').send({id: 'any-id'});
    expect(response.status).toBe(404);
  });

  it('should return 400 if ong_id is not sent', async () => {
    const response = await request(app).post('/sessions');
    expect(response.status).toBe(400);
  });

  it('should return ONG name', async () => {
    const response = await request(app).post('/sessions').send({id: ong.body.id});
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toBe("APAD2");
  });
});