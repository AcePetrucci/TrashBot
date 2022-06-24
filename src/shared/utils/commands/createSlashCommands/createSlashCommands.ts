import { REST }from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import { ISlashCommand } from 'shared/models';

import { readCommandsFiles } from '../readCommandsFiles';


/**
 * Slash Commands Creator
 */

export const createSlashCommands = () => {

  const clientID = process.env.CLIENT_ID;
  const token = process.env.TOKEN;

  const slashCommands = [];
  
  const rest = new REST({version: '10'}).setToken(token);


  /**
   * Create Slash Commands
   */

  const { flattenedCommands } = readCommandsFiles('.slash.js');

  for (const file of flattenedCommands) {
    const command = Object.values(require(file))[0] as { (): ISlashCommand };

    const slashCommand = command();

    slashCommands.push(slashCommand.data.toJSON())
  }

  rest.put(Routes.applicationCommands(clientID), {
    body: slashCommands
  });
}