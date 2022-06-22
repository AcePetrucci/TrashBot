import { Client } from 'discord.js';
import { defer, from } from 'rxjs';

import { getQuotesCommands } from './getQuotes';

import { MessageInteraction } from "shared/models";

export const getQuotesCommandsLegacy = () => {

  /**
   * Data Legacy Commands
   */

  const data = [
    '!quote',
    '!quoteratio',
    '!quotelist'
  ]


  /**
   * Execute Legacy Commands
   */

   const trigger = (message: MessageInteraction, client: Client) => {
    const { legacyCommands } = getQuotesCommands();

    return defer(() => from(legacyCommands(message, client)));
  };


  return { data, trigger };
}