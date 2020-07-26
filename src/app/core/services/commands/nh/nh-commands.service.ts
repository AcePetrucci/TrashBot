import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import TYPES from '../../../../../config/types/types';

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
      case this._lastSentMessage === '!nh -h':
        return this._nhHelp(message, client);

      case (this._lastSentMessage === '!nh' || this._lastSentMessage.includes('tag')):
        return this._nhRandomTag(message);

      default:
        return this._nhDoujinByTag(message);
    }
  }


  /**
   * NH Help
   */

  private _nhHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    return defer(() => from(message.channel.send({embed: {
      color: 0xec407a,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: `${peepoSmart} TrashBot NH Help ${peepoSmart}`,
      fields: [
        {
          name: 'Commands',
          value: `
            **!nh**
            Search for a random NH tag and return it's page.
            
            **!nh <tag_names>**
            Ex: *!nh yuri english*
            Search for a specific tag and return a random doujin which contains the specified tag(s).
          `,
        },
      ]
    }})))
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