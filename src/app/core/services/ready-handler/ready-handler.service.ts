import { Client } from 'discord.js';
import { inject, injectable } from 'inversify';
import axios from 'axios';

import TYPES from '../../../../config/types/types';

import { Observable, from, defer, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DoujinSenderService } from '../doujin-sender/doujin-sender.service';

import { IGetServerConfig, IServerConfig } from './ready-handler.model';

@injectable()
export class ReadyHandler {

  private _doujinSenderService: DoujinSenderService;

  private _guildIDs: string[];
  private readonly _quoteAPIUrl: string;


  constructor(
    @inject(TYPES.DoujinSenderService) doujinSenderService: DoujinSenderService,
    @inject(TYPES.QuoteAPIUrl) quoteAPIUrl: string
  ) {
    this._doujinSenderService = doujinSenderService;
    this._quoteAPIUrl = quoteAPIUrl;
  }


  /**
   * Main Handle Function
   */

  handleReady(client: Client) {
    this._guildIDs = [...client.guilds.cache.values()].map(guild => guild.id);

    return defer(() => from(this._guildIDs).pipe(
      mergeMap(guildID => this._getServerConfig(guildID)),
      mergeMap(server => server.config === null
        ? this._createServerConfig(server.guildID)
        : of(server.config)
      ),
      mergeMap(serverConfig => this._doujinSenderService._sendDoujin(serverConfig, client)),
    ));
  }

  private _getServerConfig(guildID: string): Observable<IGetServerConfig> {
    return from(axios.post(this._quoteAPIUrl, {
      query: `query {
        findServerConfig(guildID: "${guildID}") {
          id,
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      map(({data: {data: {findServerConfig}}}) => ({guildID, config: findServerConfig}))
    );
  }

  private _createServerConfig(guildID: string): Observable<IServerConfig> {
    return from(axios.post(this._quoteAPIUrl, {
      query: `mutation {
        createServerConfig(serverConfig: {guildID: "${guildID}"}) {
          id,
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      map(({data: {data: {createServerConfig}}}) => createServerConfig)
    );
  }
}