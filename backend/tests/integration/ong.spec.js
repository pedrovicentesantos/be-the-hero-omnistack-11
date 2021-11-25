const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('ONG Controller', () => {
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

  describe('create method', () => {
    it('should create a new ONG', async () => {
      expect(ong.body).toHaveProperty('id');
      expect(ong.body.id).toHaveLength(8);
    });
  });

  describe('index method', () => {
    it('should list the correct number of ONGs', async () => {
      let response = await request(app).get('/ongs');
      expect(response.body).toHaveLength(1);
  
      await request(app)
        .post('/ongs')
        .send({
          name: "APAD2",
          email: "contato@teste.com",
          whatsapp: "+55 (99) 99999-9999",
          city: "Rio de Janeiro",
          uf: "RJ"
        });
      response = await request(app).get('/ongs');
      expect(response.body).toHaveLength(2);
    });
      
    it('should list all properties of ONG', async () => {
      const response = await request(app).get('/ongs');
  
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('whatsapp');
      expect(response.body[0]).toHaveProperty('city');
      expect(response.body[0]).toHaveProperty('uf');
    });
  });

  describe('destroy method', () => {
    it('should delete an ONG', async () => {
      const response = await request(app).delete('/ongs').set('Authorization', ong.body.id);
  
      expect(response.status).toBe(204);
    });
  
    it('should return status 404 when deleting a non existing ONG', async () => {
      const response = await request(app).delete('/ongs').set('Authorization', 'any-id');
      expect(response.status).toBe(404);
    });

    it('should return status 400 if ong_id is not sent', async () => {
      const response = await request(app).get('/self');
      expect(response.status).toBe(400);
    });
  });

  describe('update method', () => {
    it('should update an ONG name', async () => {
      const response = await request(app)
        .patch('/ongs')
        .set('Authorization', ong.body.id)
        .send({
          name: "APAD",
        });
      expect(response.body.name).toBe("APAD");
    });
  
    it('should update an ONG email', async () => {
      const response = await request(app)
        .patch('/ongs')
        .set('Authorization', ong.body.id)
        .send({
          email: "teste@email.com",
        });
      expect(response.body.email).toBe("teste@email.com");
    });
  
    it('should update an ONG whatsapp', async () => {
      const response = await request(app)
        .patch('/ongs')
        .set('Authorization', ong.body.id)
        .send({
          whatsapp: "+55 (21) 99999-9999",
        });
      expect(response.body.whatsapp).toBe("+55 (21) 99999-9999");
    });

    it('should update an ONG city', async () => {
      const response = await request(app)
        .patch('/ongs')
        .set('Authorization', ong.body.id)
        .send({
          city: "Rio",
        });
      expect(response.body.city).toBe("Rio");
    });

    it('should update an ONG uf', async () => {
      const response = await request(app)
        .patch('/ongs')
        .set('Authorization', ong.body.id)
        .send({
          uf: "ES",
        });
      expect(response.body.uf).toBe("ES");
    });

    it('should return status 400 if nothing is sent in body', async () => {
      const response = await request(app)
        .patch('/ongs')
        .set('Authorization', ong.body.id);
      expect(response.status).toBe(400);
    });

    it('should return status 404 if a non existing ong_id is sent', async () => {
      const response = await request(app)
        .patch('/ongs')
        .set('Authorization', 'any-id')
        .send({
          uf: "ES",
        });
      expect(response.status).toBe(404);
    });

    it('should return status 400 if ong_id is not sent', async () => {
      const response = await request(app).get('/self');
      expect(response.status).toBe(400);
    });
  });

  describe('show method', () => {
    it('should return all properties of specif ONG', async () => {
      const response = await request(app).get('/self').set('Authorization', ong.body.id);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('whatsapp');
      expect(response.body).toHaveProperty('city');
      expect(response.body).toHaveProperty('uf');
    });

    it('should return status 400 if ong_id is not sent', async () => {
      const response = await request(app).get('/self');
      expect(response.status).toBe(400);
    });

    it('should return status 404 if ong_id is from a non existing ONG', async () => {
      const response = await request(app).get('/self').set('Authorization', 'any-id');
      expect(response.status).toBe(404);
    });
  });
});