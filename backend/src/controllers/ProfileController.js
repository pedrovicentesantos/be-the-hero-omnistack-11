const connection = require('../database/connection');

module.exports = {
  async index(request,response) {
    const ong_id = request.headers.authorization;

    const incidents = await connection('incidents')
      .where('ong_id', ong_id)
      .select('*');
    
    if (incidents.length > 0) {
      return response.status(200).json(incidents);
    } else if (incidents.length === 0) {
      return response.status(204).json({message: "Ong doesn't have any incident yet"});
    }

    return response.status(400).json({error: "Ong doesn't exist"})
  },
}