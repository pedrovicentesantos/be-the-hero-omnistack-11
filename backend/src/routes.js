const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

// TODO:
// Validar se o id está sendo enviado
routes.post('/sessions', SessionController.create);

routes.get('/ongs', OngController.index);
routes.post('/ongs', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    // +55 (99) 99999-9999
    whatsapp: Joi.string().required().length(19),
    city: Joi.string().required(),
    uf: Joi.string().required().length(2),
  })
}), OngController.create);
routes.delete('/ongs', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string().required(),
  })
}, {allowUnknown: true}), OngController.destroy);
routes.patch('/ongs', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    // +55 (99) 99999-9999
    whatsapp: Joi.string().length(19),
    city: Joi.string(),
    uf: Joi.string().length(2),
  })
}), OngController.update);

routes.get('/self', OngController.show);

routes.get('/profile', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), ProfileController.index);

routes.get('/incidents', celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number(),
  })
}), IncidentController.index);
// TODO:
// Validar dados enviados
// Validar header authorization enviado
routes.post('/incidents', IncidentController.create);
routes.delete('/incidents/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  })
}), IncidentController.delete);

routes.patch('/incidents/:id', IncidentController.update);

module.exports = routes;