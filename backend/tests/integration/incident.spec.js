const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Incident Controller', () => {
  let ong;
  let incident;
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

    incident = await request(app)
      .post('/incidents')
      .set('Authorization', ong.body.id)
      .send({
        title: "Caso teste",
        description: "Descrição do caso teste",
        value: 100
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('create method', () => {
    it('should create a new incident', async () => {
      expect(incident.body).toHaveProperty('id');
      expect(incident.body.id).toBe(1);
    });

    it('should return status 404 if ONG doesn\'t exist', async () => {
      const response = await request(app)
        .post('/incidents')
        .set('Authorization', 'any-id')
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      expect(response.status).toBe(404);
    });
  });

  describe('index method', () => {
    it('should list the correct number of incidents', async () => {
      const response = await request(app).get('/incidents');
      expect(response.body).toHaveLength(1);
    });
      
    it('should list all properties of incidents', async () => {
      const response = await request(app).get('/incidents');
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('value');
    });

    it('should return 5 incidents if it\'s the first page', async () => {
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      const response = await request(app).get('/incidents');
      expect(response.body).toHaveLength(5);
    });

    it('should return 1 incident if it\'s the second page with 6 incidents', async () => {
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      await request(app)
        .post('/incidents')
        .set('Authorization', ong.body.id)
        .send({
          title: "Caso teste",
          description: "Descrição do caso teste",
          value: 100
        });
      const response = await request(app).get('/incidents').query({ page: 2 });
      expect(response.body).toHaveLength(1);
    });

    it('should set X-Total-Count header', async () => {
      const response = await request(app).get('/incidents');
      expect(response.header).toHaveProperty('x-total-count');
      expect(response.header['x-total-count']).toBe('1');
    });
  });

  describe('destroy method', () => {
    it('should delete an incident', async () => {
      const response = await request(app)
        .delete('/incidents/1')
        .set('Authorization', ong.body.id);
      expect(response.status).toBe(204);
    });
  
    it('should return status 404 when deleting a non existing incident', async () => {
      const response = await request(app).delete('/incidents/2').set('Authorization', ong.body.id);
      expect(response.status).toBe(404);
    });

    it('should return status 401 if ong_id is not the same of incident', async () => {
      const new_ong = await request(app)
      .post('/ongs')
      .send({
        name: "APAD2",
        email: "contato@teste.com",
        whatsapp: "+55 (99) 99999-9999",
        city: "Rio de Janeiro",
        uf: "RJ"
      });
      const response = await request(app).delete('/incidents/1').set('Authorization', new_ong.body.id);
      expect(response.status).toBe(401);
    });

    it('should return status 404 if ong_id is of a not existing ONG', async () => {
      const response = await request(app).delete('/incidents/1').set('Authorization', 'any-id');
      expect(response.status).toBe(404);
    });
  });

  describe('update method', () => {
    it('should update an incident title', async () => {
      const response = await request(app)
        .patch('/incidents/1')
        .set('Authorization', ong.body.id)
        .send({
          title: "Title",
        });
      expect(response.body.title).toBe("Title");
    });
  
    it('should update an incident description', async () => {
      const response = await request(app)
        .patch('/incidents/1')
        .set('Authorization', ong.body.id)
        .send({
          description: "Description",
        });
      expect(response.body.description).toBe("Description");
    });
  
    it('should update an incident value', async () => {
      const response = await request(app)
        .patch('/incidents/1')
        .set('Authorization', ong.body.id)
        .send({
          value: 200,
        });
      expect(response.body.value).toBe(200);
    });

    it('should return status 400 if nothing is sent in body', async () => {
      const response = await request(app)
        .patch('/incidents/1')
        .set('Authorization', ong.body.id);
      expect(response.status).toBe(400);
    });

    it('should return status 404 if a non existing ong_id is sent', async () => {
      const response = await request(app)
        .patch('/incidents/1')
        .set('Authorization', 'any-id')
        .send({
          value: 200,
        });
      expect(response.status).toBe(404);
    });

    it('should return status 404 if a non existing incident is sent', async () => {
      const response = await request(app)
        .patch('/incidents/2')
        .set('Authorization', ong.body.id)
        .send({
          value: 200,
        });
      expect(response.status).toBe(404);
    });

    it('should return status 401 if ong_id is not the same of incident', async () => {
      const new_ong = await request(app)
        .post('/ongs')
        .send({
          name: "APAD2",
          email: "contato@teste.com",
          whatsapp: "+55 (99) 99999-9999",
          city: "Rio de Janeiro",
          uf: "RJ"
        });
      const response = await request(app)
        .patch('/incidents/1')
        .set('Authorization', new_ong.body.id)
        .send({
          value: 200,
        });
      expect(response.status).toBe(401);
    });

    it('should return status 400 if ong_id is not sent', async () => {
      const response = await request(app)
        .patch('/incidents/1')
        .send({
          value: 200,
        });
      expect(response.status).toBe(400);
    });
  });
});