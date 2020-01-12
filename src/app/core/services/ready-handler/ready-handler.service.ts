import { Client, TextChannel } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { channels } from '../../../utils/keywords/channels';

import { Observable, from, defer, interval, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { DoujinFinderService } from '../doujin-finder/doujin-finder.service';

@injectable()
export class ReadyHandler {

  private _currentInterval = new BehaviorSubject<number>(10000);

  private _doujinFinderService: DoujinFinderService;
  private _lastTimer = 0;
  private _incrementMs = 16000000;

  private _dayMs = 1000 * 60 * 60 * 24;

  constructor(
    @inject(TYPES.DoujinFinderService) doujinFinderService: DoujinFinderService
  ) {
    this._doujinFinderService = doujinFinderService;
  }


  /**
   * Main Handle Function
   */
  
  handleReady(client: Client) {
    return this._currentInterval.pipe(
      switchMap(timer => this._sendDoujin(timer, client)),
    );
  }

  private _sendDoujin(currentInterval: number, client: Client) {
    return interval(currentInterval).pipe(
      switchMap(_ => this._prepareObservableChannel(client)),
      map(channel => channel.send(this._doujinFinderService.findDoujin())),
      tap(_ => this._dayTimer()),
    )
  }


  /**
   * Ready Observable
   */

  private _prepareObservableChannel(client: Client) {
    return defer(() => from(this._findBotChannels(client)));
  }


  /**
   * Get Bots Channels
   */

  private _findBotChannels(client: Client) {
    return client.channels
      .findAll('type', 'text')
      .filter((ch: TextChannel) => channels.includes(ch.name)) as TextChannel[];
  }


  /**
   * Day Timer
   */

  private _dayTimer(needToIncrement = 0) {
    const generatedTimer = Math.floor(Math.random() * this._dayMs + 1);

    return (generatedTimer + this._lastTimer + needToIncrement) > this._dayMs
      ? this._currentInterval.next(generatedTimer)
      : this._dayTimer(needToIncrement + this._incrementMs);
  }

}