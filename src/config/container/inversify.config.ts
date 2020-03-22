import 'reflect-metadata';
import { Container } from 'inversify';
import { Client } from 'discord.js';

import { TYPES } from '../typings/types';

import { TrashBot } from '../../app/components/main/main.bot';

import { MessageHandler } from '../../app/core/services/message-handler/message-handler.service';
import { ReadyHandler } from '../../app/core/services/ready-handler/ready-handler.service';

import { DoujinFinderService } from '../../app/core/services/doujin-finder/doujin-finder.service';

import { ScreamCommandsService } from '../../app/core/services/commands/scream/scream-commands.service';
import { NhCommandsService } from '../../app/core/services/commands/nh/nh-commands.service';
import { QuoteCommandsService } from '../../app/core/services/commands/quote/quote-commands.service';
import { AddQuoteCommandsService } from '../../app/core/services/commands/addquote/addquote-commands.service';
import { AsciiCommandsService } from '../../app/core/services/commands/ascii/ascii-commands.service';

const container = new Container();

container.bind<TrashBot>(TYPES.TrashBot).to(TrashBot).inSingletonScope();

container.bind<MessageHandler>(TYPES.MessageHandler).to(MessageHandler).inSingletonScope();
container.bind<ReadyHandler>(TYPES.ReadyHandler).to(ReadyHandler).inSingletonScope();

container.bind<DoujinFinderService>(TYPES.DoujinFinderService).to(DoujinFinderService).inSingletonScope();

container.bind<ScreamCommandsService>(TYPES.ScreamCommandsService).to(ScreamCommandsService).inSingletonScope();
container.bind<NhCommandsService>(TYPES.NhCommandsService).to(NhCommandsService).inSingletonScope();
container.bind<QuoteCommandsService>(TYPES.QuoteCommandsService).to(QuoteCommandsService).inSingletonScope();
container.bind<AddQuoteCommandsService>(TYPES.AddQuoteCommandsService).to(AddQuoteCommandsService).inSingletonScope();
container.bind<AsciiCommandsService>(TYPES.AsciiCommandsService).to(AsciiCommandsService).inSingletonScope();

container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

container.bind<string>(TYPES.DoujinUrl).toConstantValue(process.env.DOUJIN_URL);
container.bind<string>(TYPES.QuoteAPIUrl).toConstantValue(process.env.QUOTE_API);

export default container;