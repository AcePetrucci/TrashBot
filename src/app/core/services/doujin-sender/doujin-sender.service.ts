import { Client, TextChannel } from 'discord.js';
import { injectable, inject } from 'inversify';
import axios from 'axios';

import { from, defer, interval, BehaviorSubject, Observable } from 'rxjs';
import { map, tap, switchMap, mergeMap, shareReplay, catchError } from 'rxjs/operators';

import { channels } from '../../../utils/keywords/channels';

import TYPES from '../../../../config/types/types';

import { DoujinFinderService } from '../doujin-finder/doujin-finder.service';

import { IServerConfig, INhenServerConfig, IGetServerConfig } from '../ready-handler/ready-handler.model';

@injectable()
export class DoujinSenderService {

  private _doujinFinderService: DoujinFinderService;

  private _dayMs = 1000 * 60 * 60 * 24;
  private _lastTimer = 0;
  private _incrementMs = 16000000;

  private _generateTimer = () => Math.floor(Math.random() * this._dayMs + 1);

  private readonly _quoteAPIUrl: string;

  constructor(
    @inject(TYPES.DoujinFinderService) doujinFinderService: DoujinFinderService,
    @inject(TYPES.QuoteAPIUrl) quoteAPIUrl: string
  ) {
    this._doujinFinderService = doujinFinderService;
    this._quoteAPIUrl = quoteAPIUrl;
  }


  /**
   * Main Doujin Handler
   */
  
  _sendDoujin(serverConfig: IServerConfig, client: Client) {
    const nhenServerConfig: INhenServerConfig = {
      serverConfig,
      timer: new BehaviorSubject<number>(this._generateTimer())
    };

    return nhenServerConfig.timer.pipe(
      switchMap(timer => interval(timer)),
      switchMap(() => this._prepareObservableChannel(client, serverConfig)),
      switchMap(channel => this._getServerConfig(serverConfig.guildID).pipe(
        map(updatedServerConfig => ({channel, updatedServerConfig}))
      )),
      switchMap(instance => instance.updatedServerConfig.nhenDisable
        ? Promise.resolve()
        : instance.channel.send(this._doujinFinderService.findDoujin())
      ),
      tap(_ => this._dayTimer(nhenServerConfig)),
    )
  }

  /**
   * Ready Observable
   */

   private _prepareObservableChannel(client: Client, serverConfig: IServerConfig) {
    return defer(() => from(this._findBotChannel(client, serverConfig)));
  }


  /**
   * Get Bots Channels
   */

  private async _findBotChannel(client: Client, serverConfig: IServerConfig) {
    const guild = await client.guilds.fetch(serverConfig.guildID);

    return guild.channels.cache.find(ch => (
      channels.includes(ch.name) 
      && ch.type === 'GUILD_TEXT')
    ) as TextChannel;
  }


  /**
   * Day Timer
   */

  private _dayTimer(nhenServerConfig: INhenServerConfig, needToIncrement = 0) {
    const generatedTimer = this._generateTimer();

    return (generatedTimer + this._lastTimer + needToIncrement) > this._dayMs
      ? nhenServerConfig.timer.next(generatedTimer)
      : this._dayTimer(nhenServerConfig, needToIncrement + this._incrementMs);
  }


  /**
   * Refresh Server Configs
   */

  private _getServerConfig(guildID: string): Observable<IServerConfig> {
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
      map(({data: {data: {findServerConfig}}}) => findServerConfig)
    );
  }

}