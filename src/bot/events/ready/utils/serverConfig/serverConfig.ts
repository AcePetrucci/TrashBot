import axios from "axios";

import { defer, from, Observable, of } from "rxjs";
import { map, mergeMap } from 'rxjs/operators';

import { IClient, IGetServerConfig, IServerConfig } from "shared/models";


/**
 * Server Config
 */

export const serverConfig = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Set Server Config
   */

  const setServerConfig = (client: IClient) => {
    const _guildIDs = [...client.guilds.cache.values()].map(guild => guild.id);

    return defer(() => from(_guildIDs).pipe(
      mergeMap(guildID => _getServerConfig(guildID)),
      mergeMap(server => server.config === null
        ? _createServerConfig(server.guildID)
        : of(server.config)
      )
    ));
  }


  /**
   * Fetch Server Config
   */

  const _getServerConfig = (
    guildID: string
  ): Observable<IGetServerConfig> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findServerConfig(guildID: "${guildID}") {
          id,
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      map(({data}) => ({guildID, config: data.data.findServerConfig}))
    );
  }


  /**
   * Create Server Config
   */

  const _createServerConfig = (
    guildID: string
  ): Observable<IServerConfig> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `mutation {
        createServerConfig(serverConfig: {guildID: "${guildID}"}) {
          id,
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      map(({data}) => data.data.createServerConfig)
    );
  }



  /**
   * Return Server Config
   */

  return { setServerConfig };
}