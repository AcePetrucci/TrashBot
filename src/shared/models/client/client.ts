import { Client, Collection } from 'discord.js';

export interface IClient extends Client {
  slashCommands?: Collection<unknown, unknown>;
  legacyCommands?: Collection<unknown, unknown>;
}