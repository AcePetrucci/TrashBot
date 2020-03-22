require('dotenv').config();

const http = require('http');

import container from '../config/container/inversify.config';
import TYPES from '../config/types/types';

import { TrashBot } from './components/main/main.bot';

const trashBot = container.get<TrashBot>(TYPES.TrashBot);
const server = http.createServer((req, res) => {
  res.statusCode = 200;
});

trashBot.listen().then(() => console.log('Logged in!')).catch((error) => console.log('RIP', error));

server.listen(parseInt(process.env.PORT) || 8080, '0.0.0.0', () => {
  console.log('Listening to 127.0.0.1:8080');
});