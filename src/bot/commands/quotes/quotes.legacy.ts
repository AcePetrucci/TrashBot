import { Client } from 'discord.js';
import { defer, from } from 'rxjs';

import { quotesCommands } from './quotes';

import { MessageInteraction } from "shared/models";

export const quotesCommandsLegacy = () => {

  /**
   * Data Legacy Commands
   */

  const data = [
    '!quote',
    '!quoteratio',
    '!quotelist',
    '!addquote',
    '!dquote'
  ]


  /**
   * Execute Legacy Commands
   */

   const trigger = (message: MessageInteraction, client: Client) => {
    const { legacyCommands } = quotesCommands();

    return defer(() => from(legacyCommands(message, client)));
  };


  return { data, trigger };
}