const connection = require('../database/connection');

module.exports = {
  async index(request,response) {
    try {
      const { page = 1 } = request.query;
  
      const [count] = await connection('incidents')
        .count();
  
      const incidents = await connection('incidents')
        .leftJoin('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .offset((page-1) * 5)
        .limit(5)
        .select([
          'incidents.*',
          'ongs.name',
          'ongs.email',
          'ongs.whatsapp',
          'ongs.city',
          'ongs.uf'
        ]);
  
      response.header('X-Total-Count', count['count(*)']);
      return response.json(incidents);
    } catch (error) {
      console.log(error);
      return response.status(500).json({error: error.message});
    }
  },

  async create(request, response) {
    try {
      const { title, description, value } = request.body;
      // Guarda infos do contexto da requisição
      // Quem tá autenticado, localização
      const ong_id = request.headers.authorization;
  
      const [id] = await connection('incidents').insert({
        title,
        description,
        value,
        ong_id,
      });
  
      if (id >= 0) {
        return response.status(200).json({ id });
      }
      return response.status(400).json({error: "Error saving incident"});
    } catch (error) {
      console.log(error);
      return response.status(500).json({error: error.message});
    }
  },

  async delete(request,response) {
    try {
      const { id } = request.params;
      const ong_id = request.headers.authorization;
  
      const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();
      
      if (!incident) return response.status(404).json({error: 'Incident not found'});
  
      if (incident.ong_id !== ong_id) {
        return response.status(401).json({ error: 'Operation not permitted. Unauthorized'});
      }
      const rows = await connection('incidents').where('id',id).delete();
      if (rows > 0) {
        return response.status(204).send();
      }
      return response.status(400).json({ error: 'Error when deleting incident'});
    } catch (error) {
      console.log(error);
      return response.status(500).json({error: error.message});
    }
  },

  async update(request, response) {
    try {
      const { id } = request.params;
      const ong_id = request.headers.authorization;

      const { title, description, value } = request.body;

      if (!title && !description && !value) {
        return response.status(400).json({ error: 'Error when updating. Need at least one key'});
      }

      const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

      if (!incident) return response.status(404).json({error: 'Incident not found'});

      if (incident.ong_id !== ong_id) {
        return response.status(401).json({ error: 'Operation not permitted. Unauthorized'});
      }

      const row = await connection('incidents')
        .where('id', id)
        .update({
          title,
          description,
          value
        });

      if (row > 0) {
        return response.status(204).send();
      }

      return response.status(400).json({ error: 'Error when updating incident'});
    } catch (error) {
      console.log(error);
      return response.status(500).json({error: error.message});
    }
  }
};