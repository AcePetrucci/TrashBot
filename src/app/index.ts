require('dotenv').config();

const http = require('http');

import container from '../config/container/inversify.config';
import { TYPES } from '../config/typings/types';

import { TrashBot } from './components/main/main.bot';

const trashBot = container.get<TrashBot>(TYPES.TrashBot);
const server = http.createServer((req, res) => {
  res.statusCode = 200;
});

server.listen(8080, '127.0.0.1', () => {
  console.log('Listening to 127.0.0.1:8080');
  trashBot.listen().then(() => console.log('Logged in!')).catch((error) => console.log('RIP', error));
});