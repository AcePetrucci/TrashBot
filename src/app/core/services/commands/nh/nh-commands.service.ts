import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../../config/typings/types';

import { from, defer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { DoujinFinderService } from '../../doujin-finder/doujin-finder.service';

import { findEmoji } from '../../../../utils/emojis/emojis';

@injectable()
export class NhCommandsService {

  private _doujinFinderService: DoujinFinderService;

  private _findEmoji;
  private _lastSentMessage = '';

  constructor(
    @inject(TYPES.DoujinFinderService) doujinFinderService: DoujinFinderService
  ) {
    this._doujinFinderService = doujinFinderService;
  }


  /**
   * NH Commands Central
   */

  nhCommands(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);
    this._lastSentMessage = message.content.toLowerCase();

    switch (true) {
      case this._lastSentMessage === '!nh':
        return this._nhHelp(message);

      case this._lastSentMessage.includes('tag'):
        return this._nhRandomTag(message);

      default:
        return this._nhDoujinByTag(message);
    }
  }


  /**
   * NH Help
   */

  private _nhHelp(message: Message) {
    const pepeS = this._findEmoji('PepeS');

    return defer(() => from(message.reply(`Help will come, someday, sometime ${pepeS}`)));
  }


  /**
   * NH Random Tag
   */

  private _nhRandomTag(message: Message) {
    return defer(() => from(message.channel.send(this._doujinFinderService.findTagPage())));
  }


  /**
   * NH Doujin by Tag
   */

  private _nhDoujinByTag(message: Message) {
    const tag = this._lastSentMessage.slice(4);
    const ayaya = this._findEmoji('AYAYA');

    return defer(() => this._doujinFinderService.findDoujinByTag(tag).pipe(
      switchMap(doujin => message.channel.send(doujin)),
      catchError(err => message.channel.send(`${ayaya} It seems your tag search doesn't exist ${ayaya}`))
    ));
  }

}