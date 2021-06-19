import { Message, Client } from 'discord.js';
import { injectable, inject } from 'inversify';

import { from, defer } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import { findEmoji } from '../../../../utils/emojis/emojis';
import { formatQuote, sendQuote } from '../../../../utils/quotes/quotes';
import { sendError } from '../../../../utils/errors/errors';

import TYPES from '../../../../../config/types/types';

import axios from 'axios';

@injectable()
export class AddQuoteCommandsService {

  private _findEmoji;
  private _guildID: string;
  private readonly _quoteAPIUrl: string;

  constructor(
    @inject(TYPES.QuoteAPIUrl) quoteAPIUrl: string
  ) {
    this._quoteAPIUrl = quoteAPIUrl;
  }


  /**
   * Add Quotes Commands Central
   */

  addQuoteCommands(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);
    this._guildID = message.guild.id;

    switch (true) {
      case ((message.content === '!addquote -h') || (message.content === '!addquote')):
        return this._addQuoteHelp(message, client);

      default:
        return this._addQuote(message, client);
    }
  }


  /**
   * Add Quote
   */

  private _addQuote(message: Message, client: Client) {
    const authorID = message.mentions.users.first()?.id ?? null;
    const [quote, ...tails] = message.content.slice(10).split(' - ');

    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `mutation {
        createQuote(quote: {
          authorID: "${authorID}",
          guildID: "${this._guildID}",
          quote: "${quote}"
        }) {
          indexNum
        }
      }`,
    })).pipe(
      map(({ data: { data: { createQuote: quote } } }) => formatQuote(`Quote #${quote.indexNum} has been created.`)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('Could not create the quote. Are you sure you followed the guidelines?', message, client))
    ));
  }


  /**
   * Add Quote Help
   */

  private _addQuoteHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    return defer(() => from(message.channel.send({
      embed: {
        color: 0xec407a,
        author: {
          name: client.user.username,
          iconURL: client.user.avatarURL()
        },
        title: `${peepoSmart} TrashBot AddQuote Help ${peepoSmart}`,
        fields: [
          {
            name: 'Commands',
            value: `
              **!addquote** or **!addquote -h**
              Shows the addquote help panel (this one right here).
  
              **!addquote <quote> - <user_mention>**
              Ex: *!addquote Eu vim ver o macaco - <@${message.author.id}>*
              Adds the specified quote while saving it's owner.
            `,
          },
        ]
      }
    })))
  }

}