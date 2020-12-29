const generateUniqueId = require('../utils/generateUniqueId');
const connection = require('../database/connection');

module.exports = {
  async index(request,response) {
    const ongs = await connection('ongs').select('*');
  
    return response.json(ongs);
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
  }
}