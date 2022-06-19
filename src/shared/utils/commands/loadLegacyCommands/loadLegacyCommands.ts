import { Collection } from 'discord.js';

import { IClient, ILegacyCommand } from 'shared/models';

import { readCommandsFiles } from '../readCommandsFiles';

export const loadLegacyCommands = (client: IClient) => {

  client.legacyCommands = new Collection();


  /**
   * Load Legacy Commands
   */

  const { flattenedCommands } = readCommandsFiles('.legacy.js');

  for (const file of flattenedCommands) {
    const command = Object.values(require(file))[0] as { (): ILegacyCommand };

    const legacyCommands = command();

    legacyCommands.data.forEach(commandName => {
      client.legacyCommands.set(commandName, legacyCommands)
    })
  }
}