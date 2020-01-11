import 'reflect-metadata';
import { Container } from 'inversify';
import { Client } from 'discord.js';

import { TYPES } from '../typings/types';

import { TrashBot } from '../../app/components/main/main.bot';

const container = new Container();

container.bind<TrashBot>(TYPES.TrashBot).to(TrashBot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

export default container;