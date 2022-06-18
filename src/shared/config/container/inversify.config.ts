import 'reflect-metadata';
import { Container } from 'inversify';
import { Client, Intents } from 'discord.js';

import { TYPES } from 'shared/config/types';

import { TrashBot } from 'core/main';

import { MessageHandlerEvents, ReadyHandlerEvents } from 'bot/events';

import {
  DoujinFinderService,
  DoujinSenderService
} from 'bot/services/doujin';

import {
  NhCommands,
  CustomCommands,
  QuoteCommands,
  AddQuoteCommands,
  DeleteQuoteCommands,
} from 'bot/commands';

// import { MusicCommandsService } from '../../../bot/commands/music/music-commands.service';

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

container.bind<MessageHandlerEvents>(TYPES.MessageHandlerEvents).to(MessageHandlerEvents).inSingletonScope();
container.bind<ReadyHandlerEvents>(TYPES.ReadyHandlerEvents).to(ReadyHandlerEvents).inSingletonScope();

container.bind<DoujinFinderService>(TYPES.DoujinFinderService).to(DoujinFinderService).inSingletonScope();
container.bind<DoujinSenderService>(TYPES.DoujinSenderService).to(DoujinSenderService).inSingletonScope();

container.bind<NhCommands>(TYPES.NhCommands).to(NhCommands).inSingletonScope();
container.bind<QuoteCommands>(TYPES.QuoteCommands).to(QuoteCommands).inSingletonScope();
container.bind<AddQuoteCommands>(TYPES.AddQuoteCommands).to(AddQuoteCommands).inSingletonScope();
container.bind<DeleteQuoteCommands>(TYPES.DeleteQuoteCommands).to(DeleteQuoteCommands).inSingletonScope();
container.bind<CustomCommands>(TYPES.CustomCommands).to(CustomCommands).inSingletonScope();
// container.bind<MusicCommands>(TYPES.MusicCommands).to(MusicCommands).inSingletonScope();

container.bind<Client>(TYPES.Client).toConstantValue(new Client({intents}));
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

container.bind<string>(TYPES.DoujinUrl).toConstantValue(process.env.DOUJIN_URL);
container.bind<string>(TYPES.QuoteAPIUrl).toConstantValue(process.env.QUOTE_API);

export default container;