import 'reflect-metadata';
import { Container } from 'inversify';
import { Client, Intents } from 'discord.js';

import TYPES from '../types/types';

import { TrashBot } from '../../app/components/main/main.bot';

import { MessageHandler } from '../../app/core/services/message-handler/message-handler.service';
import { ReadyHandler } from '../../app/core/services/ready-handler/ready-handler.service';

import { DoujinFinderService } from '../../app/core/services/doujin-finder/doujin-finder.service';
import { DoujinSenderService } from '../../app/core/services/doujin-sender/doujin-sender.service';

import { NhCommandsService } from '../../app/core/services/commands/nh/nh-commands.service';
import { QuoteCommandsService } from '../../app/core/services/commands/quote/quote-commands.service';
import { AddQuoteCommandsService } from '../../app/core/services/commands/addquote/addquote-commands.service';
import { DeleteQuoteCommandsService } from '../../app/core/services/commands/deletequote/deletequote-commands.service';
import { CustomCommandsService } from '../../app/core/services/commands/custom/custom-commands.service';
// import { MusicCommandsService } from '../../app/core/services/commands/music/music-commands.service';

const container = new Container();
const intents = [
  Intents.FLAGS.DIRECT_MESSAGES,
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_VOICE_STATES
]

container.bind<TrashBot>(TYPES.TrashBot).to(TrashBot).inSingletonScope();

container.bind<MessageHandler>(TYPES.MessageHandler).to(MessageHandler).inSingletonScope();
container.bind<ReadyHandler>(TYPES.ReadyHandler).to(ReadyHandler).inSingletonScope();

container.bind<DoujinFinderService>(TYPES.DoujinFinderService).to(DoujinFinderService).inSingletonScope();
container.bind<DoujinSenderService>(TYPES.DoujinSenderService).to(DoujinSenderService).inSingletonScope();

container.bind<NhCommandsService>(TYPES.NhCommandsService).to(NhCommandsService).inSingletonScope();
container.bind<QuoteCommandsService>(TYPES.QuoteCommandsService).to(QuoteCommandsService).inSingletonScope();
container.bind<AddQuoteCommandsService>(TYPES.AddQuoteCommandsService).to(AddQuoteCommandsService).inSingletonScope();
container.bind<DeleteQuoteCommandsService>(TYPES.DeleteQuoteCommandsService).to(DeleteQuoteCommandsService).inSingletonScope();
container.bind<CustomCommandsService>(TYPES.CustomCommandsService).to(CustomCommandsService).inSingletonScope();
// container.bind<MusicCommandsService>(TYPES.MusicCommandsService).to(MusicCommandsService).inSingletonScope();

container.bind<Client>(TYPES.Client).toConstantValue(new Client({intents}));
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

container.bind<string>(TYPES.DoujinUrl).toConstantValue(process.env.DOUJIN_URL);
container.bind<string>(TYPES.QuoteAPIUrl).toConstantValue(process.env.QUOTE_API);

export default container;