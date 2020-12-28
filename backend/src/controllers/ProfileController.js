const connection = require('../database/connection');

module.exports = {
  async index(request,response) {
    const ong_id = request.headers.authorization;

    const incidents = await connection('incidents')
      .where('ong_id', ong_id)
      .select('*');
    
    if (incidents.length > 0) {
      return response.status(200).json(incidents);
    }

    return response.status(400).json({error: "Ong doesn't exists"})
  },
}