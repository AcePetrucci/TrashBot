import { catchError, mergeMap, of } from 'rxjs';

import { serverConfig } from './utils';

import {
  createSlashCommands,
  loadSlashCommands,
  loadLegacyCommands,
} from 'shared/utils'

import { IClient } from 'shared/models';

import { doujinSenderService } from 'bot/services';

export const readyEvent = (
  client: IClient
) => {

  const { setServerConfig } = serverConfig();
  const { sendDoujin } = doujinSenderService();

  /**
   * Client Ready
   */
  
  const clientReady = () => {
    client.once('ready', () => {
      client.user.setActivity('!trash or !trash -h');

      setServerConfig(client).pipe(
        mergeMap(serverConfig => sendDoujin(serverConfig, client)),
        catchError(err => of(err))
      ).subscribe();

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