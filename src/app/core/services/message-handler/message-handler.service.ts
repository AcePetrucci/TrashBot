import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer, of } from 'rxjs';

import { DoujinFinderService } from '../doujin-finder/doujin-finder.service';

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
        case message.content.toLowerCase().includes('tag'):
          return defer(() => from(message.channel.send(this._doujinFinderService.findTagPage())));

        case message.content === '!trash':
          const pepeS = client.emojis.find(emoji => emoji.name === 'PepeS');
          return defer(() => from(message.reply(`Help will come, someday, sometime ${pepeS}`)));

        default:
          const smugNep = client.emojis.find(emoji => emoji.name === 'SmugNep');
          return defer(() => from(message.reply(`${smugNep} I can't do this shit (yet) ${smugNep}`)));
      }
    }

    return defer(() => from(Promise.reject()));
  }

}