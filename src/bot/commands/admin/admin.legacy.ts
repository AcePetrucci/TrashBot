import { Client } from 'discord.js';
import { defer, from } from 'rxjs';

import { adminCommands } from './admin';

import { MessageInteraction } from "shared/models";

export const adminCommandsLegacy = () => {

  /**
   * Data Legacy Commands
   */

  const data = [
    '!setStatus',
  ]


  /**
   * Execute Legacy Commands
   */

   const trigger = (message: MessageInteraction, client: Client) => {
    const { legacyCommands } = adminCommands();

    return defer(() => from(legacyCommands(message, client)));
  };


  return { data, trigger };
}