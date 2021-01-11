const generateUniqueId = require('../utils/generateUniqueId');
const connection = require('../database/connection');
const { response } = require('express');
const { on } = require('../database/connection');

module.exports = {
  async index(request,response) {
    const ongs = await connection('ongs').select('*');
  
    return response.json(ongs);
  },

  async show (request, response) {
    const ong_id = request.headers.authorization;

    const ong = await connection('ongs').where('id', ong_id).first();
  
    if (ong) {
      return response.status(200).json(ong);
    }
    return response.status(404).json({error: "ONG não existe"});
  },
  
  async create(request,response) {
    const { name, email, whatsapp, city, uf } = request.body;

    const id = generateUniqueId();

    const resp = await connection('ongs').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    });

    if (resp >= 0) {
      return response.status(200).json({id});
    }
    
    return response.status(400).json({error: "Erro ao salvar ONG"});
  },

  async destroy(request, response) {
    const ong_id = request.headers.authorization;

    const ong = await connection('ongs').where('id', ong_id).first();
    
    if (ong) {

      const incidents = await connection('incidents')
      .where('ong_id', ong_id)
      .delete();

      if (incidents >= 0) {
        
        const row = await connection('ongs').where('id', ong_id).delete();
    
        if (row > 0) {
          return response.status(204).send();
        }
    
        return response.status(400).json({ error: 'Error when deleting'});
      } 

      return response.status(406).json({ error: 'Erro ao deletar os incidentes da ONG' })

    } 
    
    return response.status(404).json({ error: 'ONG não existe'});

  },

  async update(request, response) {
    const ong_id = request.headers.authorization;

    const { name, email, whatsapp, city, uf } = request.body;

    const row = await connection('ongs')
      .where('id', ong_id)
      .update( {
        name,
        email,
        whatsapp,
        city,
        uf
      });

    if (row > 0) {
      const ong = await connection('ongs')
      .select('*')
      .where('id', ong_id)
      .first();
      if (ong) {
        return response.status(200).json(ong);
      }
    }

    return response.status(400).json({ error: 'Error when updating'});
  }
}