import { Client } from 'discord.js';
import { defer, from } from 'rxjs';

import { customCommands } from './command';

import { MessageInteraction } from "shared/models";

export const customCommandsLegacy = () => {

  /**
   * Data Legacy Commands
   */

  const data = [
    '!addcommand',
    '!dcommand',
    '!commandlist',
    '!command',
    '!',
  ]


  /**
   * Execute Legacy Commands
   */

   const trigger = (message: MessageInteraction, client: Client) => {
    const { legacyCommands } = customCommands();

    return defer(() => from(legacyCommands(message, client)));
  };


  return { data, trigger };
}