const connection = require('../database/connection');

module.exports = {
  async index(request,response) {
    try {
      const ong_id = request.headers.authorization;

      const ong = await connection('ongs').where('id', ong_id).first();
    
      if (ong) {
        const incidents = await connection('incidents')
          .where('ong_id', ong_id)
          .select('*');
        
        if (incidents.length > 0) {
          return response.status(200).json(incidents);
        } else if (incidents.length === 0) {
          return response.status(204).send();
        }
      }
      return response.status(404).json({error: "ONG não existe"});
    } catch (error) {
      console.log(error);
    }
  },
}