import { Message, Client, MessageEmbed } from 'discord.js';
import { injectable, inject } from 'inversify';

import { from, defer } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import { findEmoji } from '../../../../utils/emojis/emojis';
import { formatQuote, sendQuote } from '../../../../utils/quotes/quotes';
import { sendError } from '../../../../utils/errors/errors';

import TYPES from '../../../../../config/types/types';

import axios from 'axios';

@injectable()
export class DeleteQuoteCommandsService {

  private _findEmoji;
  private _guildID: string;
  private _commands: string[];
  private readonly _quoteAPIUrl: string;

  constructor(
    @inject(TYPES.QuoteAPIUrl) quoteAPIUrl: string
  ) {
    this._quoteAPIUrl = quoteAPIUrl;
    this._commands = [
      '!dquote',
      '!dquote -h',
    ];
  }


  /**
   * Delete Quotes Commands Central
   */

  deleteQuoteCommands(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);
    this._guildID = message.guild.id;

    switch (true) {
      case this._commands.some(command => command === message.content):
        return this._deleteQuoteHelp(message, client);

      default:
        return this._deleteQuote(message, client);
    }
  }


  /**
   * Delete Quote
   */

  private _deleteQuote(message: Message, client: Client) {
    const indexNum = message.content.slice(8);

    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `mutation {
        deleteByIndexNumQuote(guildID: "${this._guildID}", indexNum: ${+indexNum}) {
          indexNum
        }
      }`,
    })).pipe(
      switchMap(({ data: { data: { deleteByIndexNumQuote: quote } } }) => formatQuote(`Quote #${quote.indexNum} has been deleted.`)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('Could not delete the quote. Are you sure you followed the guidelines?', message, client))
    ));
  }


  /**
   * Delete Quote Help
   */

  private _deleteQuoteHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    const embed = new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL()
      })
      .setTitle(`${peepoSmart} TrashBot DeleteQuote Help ${peepoSmart}`)
      .setFields([
        {
          name: 'Commands',
          value: `
            **!dquote** or **!dquote -h**
            Shows the dquote help panel (this one right here).

            **!dquote <quote ID>**
            Ex: *!dquote 2*
            Delete the specified quote. Keep in mind that if it's not the last quote created, it will leave a permanent failed quote on the server.
          `,
        },
      ]);

    return defer(() => from(message.channel.send({
      embeds: [embed]
    })))
  }

}