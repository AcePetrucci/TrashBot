import {
  createSlashCommands,
  loadSlashCommands,
  loadLegacyCommands,
} from 'shared/utils'

import { IClient } from 'shared/models';

export const readyEvent = (
  client: IClient
) => {

  /**
   * Client Ready
   */
  
  const clientReady = () => {
    client.once('ready', () => {
      client.user.setActivity('!trash or !trash -h');

      createSlashCommands();
      loadSlashCommands(client);
      loadLegacyCommands(client);
    })
  };


  /**
   * Return Event
   */

  return { clientReady };
}