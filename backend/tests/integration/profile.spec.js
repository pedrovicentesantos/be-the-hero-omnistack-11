const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Profile Controller', () => {
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
    const response = await request(app).get('/profile').set('Authorization', 'any-id');
    expect(response.status).toBe(404);
  });

  it('should return 204 if ONG doesn\'t have any incidents', async () => {
    const response = await request(app).get('/profile').set('Authorization', ong.body.id);
    expect(response.status).toBe(204);
  });

  it('should return ONG incidents', async () => {
    await request(app).post('/incidents').set('Authorization', ong.body.id).send({
      title: "Caso teste",
      description: "Descrição do caso teste",
      value: 100
    });
    const response = await request(app).get('/profile').set('Authorization', ong.body.id);
    expect(response.body.length).toBe(1);
  });

  it('should return ONG incidents information', async () => {
    await request(app).post('/incidents').set('Authorization', ong.body.id).send({
      title: "Caso teste",
      description: "Descrição do caso teste",
      value: 100
    });
    const response = await request(app).get('/profile').set('Authorization', ong.body.id);
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('description');
    expect(response.body[0]).toHaveProperty('value');
  });
});