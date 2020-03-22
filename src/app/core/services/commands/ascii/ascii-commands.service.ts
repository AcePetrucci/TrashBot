import { Message, Client, TextChannel } from 'discord.js';
import { inject, injectable } from 'inversify';

import { from, defer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { formatQuote, sendQuote } from '../../../../utils/quotes/quotes';

@injectable()
export class AsciiCommandsService {

  constructor() { }

  /**
   * ASCII Commands Central
   */

  asciiCommands(message: Message, client: Client) {
    return this._formatAscii(message, client);
  }


  /**
   * Ascii
   */

  private _formatAscii(message: Message, client: Client) {
    const asciiToFormat = message.content.slice(7);
    const formattedAscii = asciiToFormat.replace(/ /g, '').match(/.{1,30}/g).join('\n');
    const generalChannel = message.guild.channels.find(channel => channel.name === 'general') as TextChannel;

    const formattedAsQuote = formatQuote(formattedAscii, message, message.author.id);

    return defer(() => from(sendQuote(formattedAsQuote, message, client, generalChannel)));
  }



}