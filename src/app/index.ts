require('dotenv').config();

import container from '../config/container/inversify.config';
import { TYPES } from '../config/typings/types';

import { TrashBot } from './components/main/main.bot';

const trashBot = container.get<TrashBot>(TYPES.TrashBot);

trashBot.listen().then(() => console.log('Logged in!')).catch((error) => console.log('RIP', error));