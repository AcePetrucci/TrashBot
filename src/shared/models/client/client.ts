import { Client, Collection } from 'discord.js';

import {
  ISlashCommand,
  ILegacyCommand
} from '../serverCommand';


/**
 * IClient with Commands Support
 */
export interface IClient extends Client {
  slashCommands?: Collection<string, ISlashCommand>;
  legacyCommands?: Collection<string, ILegacyCommand>;
}