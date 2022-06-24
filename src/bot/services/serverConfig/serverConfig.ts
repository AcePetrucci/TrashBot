import axios from "axios";

import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";

import { IServerConfig } from "shared/models";


/**
 * Server Config Service
 */

export const serverConfigService = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Create Server Config
   */

   const createServerConfig = (
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
   * Get Server Config
   */

  const getServerConfig = (
    guildID: string
  ): Observable<IServerConfig> => {
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
      map(({data}) => data.data.findServerConfig)
    );
  }


  /**
   * Return Server Config
   */

  return { createServerConfig, getServerConfig };
}