import 'module-alias/register';
require('dotenv').config();
const http = require('http');

import { TrashBot } from './core';

const server = http.createServer((req, res) => {
  res.write('TrashBot JS');
  res.end();
});

const { trashBotInit } = TrashBot();

trashBotInit().then(() => console.log('Logged In!')).catch((error) => console.log('RIP', error));
server.listen(process.env.PORT || 4444);