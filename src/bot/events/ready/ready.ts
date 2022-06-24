import { catchError, mergeMap, of } from 'rxjs';

import { serversConfig } from './utils';

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

  const developmentMode = JSON.parse(process.env.DEV);

  const { setAndFetchServersConfig } = serversConfig();
  const { sendDoujin } = doujinSenderService();

  /**
   * Client Ready
   */
  
  const clientReady = () => {
    client.on('ready', () => {
      client.user.setActivity(developmentMode
        ? 'Development Mode'  
        : '!trash or !trash -h'
      );

      setAndFetchServersConfig(client).pipe(
        mergeMap(serverConfig => sendDoujin(serverConfig, client)),
        catchError(err => of(err))
      ).subscribe();

      if (developmentMode) { createSlashCommands(); }

      loadSlashCommands(client);
      loadLegacyCommands(client);
    })
  };


  /**
   * Return Event
   */

  return { clientReady };
}