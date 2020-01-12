import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer } from 'rxjs';

@injectable()
export class MessageHandler {
  
  handleMessage(message: Message): Observable<Message | Message[]> {
    if (message.content.toLowerCase().includes('pog')) {
      return from(message.reply('Pog'));
    }

    return from(Promise.reject());
  }

}