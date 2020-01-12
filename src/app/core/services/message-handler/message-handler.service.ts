import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer } from 'rxjs';

@injectable()
export class MessageHandler {
  
  handleMessage(message: Message): Observable<Message | Message[]> {
    return from(message.reply('Pog'));
  }

}