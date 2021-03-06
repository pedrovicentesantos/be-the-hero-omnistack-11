const connection = require('../database/connection');

module.exports = {
  async index(request,response) {
    const { page = 1 } = request.query;

    const [count] = await connection('incidents')
      .count();

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page-1) * 5)
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
  },

  async create(request, response) {
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

  },

  async delete(request,response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (incident.ong_id !== ong_id) {
      return response.status(401).json({ error: 'Operation not permitted'});
    }

    const rows = await connection('incidents').where('id',id).delete();
    if (rows > 0) {
      return response.status(204).send();
    }

    return response.status(400).json({ error: 'Error when deleting'});
  },

  async update(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const { title, description, value } = request.body;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (incident.ong_id !== ong_id) {
      return response.status(401).json({ error: 'Operation not permitted'});
    }

    const row = await connection('incidents')
      .where('id', id)
      .update( {
        title,
        description,
        value
      });

    if (row > 0) {
      return response.status(204).send();
    }

    return response.status(400).json({ error: 'Error when updating'});
  }
};