import { Client } from 'discord.js';
import { defer, from } from 'rxjs';

import { nhCommands } from './nh';

import { MessageInteraction } from "shared/models";

export const nhCommandsLegacy = () => {

  /**
   * Data Legacy Commands
   */

  const data = ['!nh']


  /**
   * Execute Legacy Commands
   */

   const trigger = (message: MessageInteraction, client: Client) => {
    const { legacyCommands } = nhCommands();

    return defer(() => from(legacyCommands(message, client)));
  };


  return { data, trigger };
}