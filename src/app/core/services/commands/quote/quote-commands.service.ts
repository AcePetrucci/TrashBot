import { Message, Client } from 'discord.js';
import { injectable, inject } from 'inversify';

import { from, defer } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import { findEmoji } from '../../../../utils/emojis/emojis';
import { formatQuote, sendQuote } from '../../../../utils/quotes/quotes';
import { sendError } from '../../../../utils/errors/errors';

import { TYPES } from '../../../../../config/typings/types';

import axios from 'axios';

@injectable()
export class QuoteCommandsService {

  private _findEmoji;
  private _guildID: string;
  private readonly _quoteAPIUrl: string;

  constructor(
    @inject(TYPES.QuoteAPIUrl) quoteAPIUrl: string
  ) {
    this._quoteAPIUrl = quoteAPIUrl;
  }


  /**
   * Quotes Commands Central
   */

  showQuoteCommands(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);
    this._guildID = message.guild.id;

    switch (true) {
      case (message.content === '!quote -h'):
        return this._getQuoteHelp(message, client);

      case (message.content === '!quote'):
        return this._getRandomQuote(message, client);

      case (isNaN(+message.content.slice(7))):
        return this._getQuoteByText(message, client);

      default:
        return this._getQuoteByIndexNum(message, client);
    }
  }


  /**
   * Get Quote By Index
   */

  private _getQuoteByIndexNum(message: Message, client: Client) {
    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `query {
        findQuoteByIndexNum(indexNum: ${+message.content.slice(7)}, guildID: "${this._guildID}") {
          authorID,
          quote,
          indexNum,
          createdAt
        }
      }`,
    })).pipe(
      map(({data: {data: {findQuoteByIndexNum: quote}}}) => formatQuote(quote, message)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('There was an error trying to fetch this quote. Are you sure it does exist?', message, client))
    ));
  }


  /**
   * Get Quote By Text
   */

  private _getQuoteByText(message: Message, client: Client) {
    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `query {
        findQuotes(quoteText: "${message.content.slice(7)}", guildID: "${this._guildID}") {
          authorID,
          quote,
          indexNum,
          createdAt
        }
      }`,
    })).pipe(
      map(({data: {data: {findQuotes: quotes}}}) => quotes[Math.floor(Math.random() * quotes.length)]),
      map(quote => formatQuote(quote, message)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('There was an error trying to fetch this quote. Are you sure it does exist?', message, client))
    ));
  }


  /**
   * Get Random Quote
   */

  private _getRandomQuote(message: Message, client: Client) {
    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `query {
        findAllQuotes(guildID: "${this._guildID}") {
          authorID,
          quote,
          indexNum,
          createdAt
        }
      }`,
    })).pipe(
      map(({data: {data: {findAllQuotes: quotes}}}) => quotes[Math.floor(Math.random() * quotes.length)]),
      map(quote => formatQuote(quote, message)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('It seems this server has no quotes saved yet. Type *!addquote* to see how to add one.', message, client))
    ))
  }


  /**
   * Get Quote Help
   */

  private _getQuoteHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    return defer(() => from(message.channel.send({embed: {
      color: 0xec407a,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: `${peepoSmart} TrashBot Quote Help ${peepoSmart}`,
      fields: [
        {
          name: 'Commands',
          value: `
            **!quote**
            Shows a random quote stored on this server.

            **!quote -h**
            Shows the quote help panel (this one right here).
            
            **!quote <quote_index>**
            Ex: *!quote 1*
            Shows a specific quote based on it's index.

            **!quote <quote_text>**
            Ex: *!quote Macaco*
            Shows a random quote which contains the specified quote text.
          `,
        },
      ]
    }})))
  }

}