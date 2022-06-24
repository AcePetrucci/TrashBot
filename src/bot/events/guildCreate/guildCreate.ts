import { catchError, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IClient, IGuildServerConfig } from 'shared/models';

import { createSlashCommands } from 'shared/utils';

import { serversConfig } from '../ready/utils';

import { doujinSenderService } from 'bot/services';


/**
 * Guild Create (Server Join)
 */

export const guildCreateEvent = (
  client: IClient
) => {

  const { setServerConfig } = serversConfig();
  const { sendDoujin } = doujinSenderService();


  /**
   * Guild Create
   */
  
  const serverJoin = () => {
    client.on('guildCreate', guild => {
      const blankServerConfig: IGuildServerConfig = {
        guildID: guild.id,
        config: {
          id: '',
          nhenDisable: true,
          nhenTimer: true
        }
      };

      createSlashCommands();

      setServerConfig(blankServerConfig).pipe(
        switchMap(serverConfig => sendDoujin(serverConfig, client)),
        catchError(err => of(err))
      ).subscribe();
    })
  };


  /**
   * Return Event
   */

  return { serverJoin };
}