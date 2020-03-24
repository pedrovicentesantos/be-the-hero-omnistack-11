const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();

// Se a aplicação estiver em produção
// Deve-se usar o 'origin' em cors 
app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(3333);