import 'module-alias/register';
require('dotenv').config();


/**
 * Server Imports
 */

import { createServer } from 'http';
import { join } from 'path';
import serveStatic from 'serve-static';


/**
 * TrashBot
 */

import { TrashBot } from './core';


/**
 * Server Config
 */

const fileDir = join(__dirname, '../public');
const fileServer = serveStatic(fileDir, {
  setHeaders: res => res.setHeader('Content-Type', 'text/plain; charset=utf-8'),
})

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  fileServer(req, res, () => {
    res.write('TrashBot JS');
    res.end();
  });
});


/**
 * Initialize Server and TrashBot
 */

const { trashBotInit } = TrashBot();

trashBotInit().then(() => console.log('Logged In!')).catch((error) => console.log('RIP', error));
server.listen(process.env.PORT || 4444);