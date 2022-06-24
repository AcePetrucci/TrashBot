import { Collection } from 'discord.js';

import { IClient, ISlashCommand } from 'shared/models';

import { readCommandsFiles } from '../readCommandsFiles';


/**
 * Slash Commands Loader
 */

export const loadSlashCommands = (client: IClient) => {

  client.slashCommands = new Collection();


  /**
   * Load Slash Commands
   */

  const { flattenedCommands } = readCommandsFiles('.slash.js');

  for (const file of flattenedCommands) {
    const command = Object.values(require(file))[0] as { (): ISlashCommand };

    const slashCommand = command();

    client.slashCommands.set(slashCommand.data.name, slashCommand)
  }
}