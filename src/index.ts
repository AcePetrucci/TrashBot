import 'module-alias/register';
require('dotenv').config();

const http = require('http');

import { container } from './shared/config/container';
import { TYPES } from './shared/config/types';

import { TrashBot } from './core';

const trashBot = container.get<TrashBot>(TYPES.TrashBot);
const server = http.createServer((req, res) => {
    res.write('TrashBot JS');
    res.end();
});

trashBot.listen().then(() => console.log('Logged in!')).catch((error) => console.log('RIP', error));
server.listen(process.env.PORT || 4444);