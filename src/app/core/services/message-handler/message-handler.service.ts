import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer, of } from 'rxjs';

import { DoujinFinderService } from '../doujin-finder/doujin-finder.service';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

@injectable()
export class MessageHandler {

  private _doujinFinderService: DoujinFinderService;

  constructor(
    @inject(TYPES.DoujinFinderService) doujinFinderService: DoujinFinderService
  ) {
    this._doujinFinderService = doujinFinderService;
  }
  
  handleMessage(message: Message, client: Client): Observable<Message | Message[]> {
    if (message.content.toLowerCase().includes('!trash')) {
      switch (true) {
        case message.content === '!trash':
          const pepeS = client.emojis.find(emoji => emoji.name === 'PepeS');
          return defer(() => from(message.reply(`Help will come, someday, sometime ${pepeS}`)));

        case message.content.includes('!trash scream'):
          const lordsD = client.emojis.find(emoji => emoji.name === 'lordsD');
          const speaker = '\:loudspeaker:';
          const msgToScream = message.content.slice(14);

          return defer(() => from(message.channel.send(`${lordsD} ${speaker}  ${msgToScream.toUpperCase()}`)));

        default:
          const smugNep = client.emojis.find(emoji => emoji.name === 'SmugNep');
          return defer(() => from(message.reply(`${smugNep} I can't do this shit (yet) ${smugNep}`)));
      }
    }

    if (message.content.toLowerCase().includes('!nh')) {
      switch (true) {
        case message.content.toLowerCase() === '!nh':
          const pepeS = client.emojis.find(emoji => emoji.name === 'PepeS');
          return defer(() => from(message.reply(`Help will come, someday, sometime ${pepeS}`)));

        case message.content.toLowerCase().includes('tag'):
          return defer(() => from(message.channel.send(this._doujinFinderService.findTagPage())));

        default:
          const tag = message.content.slice(4).toLowerCase();
          const ayaya = client.emojis.find(emoji => emoji.name === 'AYAYA');

          return defer(() => this._doujinFinderService.findDoujinByTag(tag).pipe(
            switchMap(doujin => message.channel.send(doujin)),
            catchError(err => message.channel.send(`${ayaya} It seems your tag search doesn't exist ${ayaya}`))
          ));
      }
    }

    return defer(() => from(Promise.reject()));
  }

}