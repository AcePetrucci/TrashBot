import { defer, from, Observable, of } from "rxjs";
import { map, mergeMap } from 'rxjs/operators';

import { IClient, IGuildServerConfig, IServerConfig } from "shared/models";

import { serverConfigService } from 'bot/services';


/**
 * Server Config
 */

export const serversConfig = () => {

  const { createServerConfig, getServerConfig } = serverConfigService();


  /**
   * Set Server Config
   */

  const setAndFetchServersConfig = (client: IClient) => {
    const _guildIDs = [...client.guilds.cache.values()].map(guild => guild.id);

    return defer(() => from(_guildIDs).pipe(
      mergeMap(guildID => _fetchServerConfig(guildID)),
      mergeMap(server => setServerConfig(server))
    ));
  }


  /**
   * Fetch Server Config
   */

  const _fetchServerConfig = (guildID: string): Observable<IGuildServerConfig> => {
    return getServerConfig(guildID).pipe(
      map(serverConfig => ({guildID, config: serverConfig}))
    )
  }


  /**
   * Set Server Config
   */

   const setServerConfig = (server: IGuildServerConfig): Observable<IServerConfig> => {
    return !!server.config
      ? of(server.config)
      : createServerConfig(server.guildID);
  }


  /**
   * Return Server Config
   */

  return { setAndFetchServersConfig, setServerConfig };
}