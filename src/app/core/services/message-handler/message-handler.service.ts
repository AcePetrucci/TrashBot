import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer } from 'rxjs';

@injectable()
export class MessageHandler {
  
  handleMessage(message: Message, client: Client): Observable<Message | Message[]> {
    if (message.content.toLowerCase().includes('pog')) {
      const pog = client.emojis.find(emoji => emoji.name === 'Pog');
      return from(message.channel.send(`${pog}`));
    }

    return from(Promise.reject());
  }

}