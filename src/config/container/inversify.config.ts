import 'reflect-metadata';
import { Container } from 'inversify';
import { Client } from 'discord.js';

import { TYPES } from '../typings/types';

import { TrashBot } from '../../app/components/main/main.bot';

import { MessageHandler } from '../../app/core/services/message-handler/message-handler.service';
import { ReadyHandler } from '../../app/core/services/ready-handler/ready-handler.service';

import { DoujinFinderService } from '../../app/core/services/doujin-finder/doujin-finder.service';

import { TrashCommandsService } from '../../app/core/services/commands/trash/trash-commands.service';
import { NhCommandsService } from '../../app/core/services/commands/nh/nh-commands.service';

const container = new Container();

container.bind<TrashBot>(TYPES.TrashBot).to(TrashBot).inSingletonScope();

container.bind<MessageHandler>(TYPES.MessageHandler).to(MessageHandler).inSingletonScope();
container.bind<ReadyHandler>(TYPES.ReadyHandler).to(ReadyHandler).inSingletonScope();

container.bind<DoujinFinderService>(TYPES.DoujinFinderService).to(DoujinFinderService).inSingletonScope();

container.bind<TrashCommandsService>(TYPES.TrashCommandsService).to(TrashCommandsService).inSingletonScope();
container.bind<NhCommandsService>(TYPES.NhCommandsService).to(NhCommandsService).inSingletonScope();

container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

export default container;