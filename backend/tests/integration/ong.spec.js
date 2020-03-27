const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('ONG', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to create a new ONG', async () => {
    // Para setar um header no request:
    // .set('Authorization',id_valido_ong)
    const response = await request(app)
      .post('/ongs')
      .send({
        name: "APAD2",
        email: "contato@teste.com",
        whatsapp: "28999114455",
        city: "Rio de Janeiro",
        uf: "RJ"
      });
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });
});