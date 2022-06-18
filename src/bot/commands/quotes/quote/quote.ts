import { Message, Client, GuildMember, MessageEmbed } from 'discord.js';
import { injectable, inject } from 'inversify';
import axios from 'axios';

import { from, defer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import {
  findEmoji,
  formatQuote,
  sendQuote,
  sendError
} from 'shared/utils';

import { TYPES } from 'shared/config/types';

@injectable()
export class QuoteCommands {

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

      case (message.content === '!quotelist'):
        return this._getQuoteList(message, client);

      case (message.content.includes("!quotecount")):
        return this._getQuoteCount(message, client);

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
      switchMap(({ data: { data: { findQuoteByIndexNum: quote } } }) => formatQuote(quote, message)),
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
      map(({ data: { data: { findQuotes: quotes } } }) => quotes[Math.floor(Math.random() * quotes.length)]),
      switchMap(quote => formatQuote(quote, message)),
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
      map(({ data: { data: { findAllQuotes: quotes } } }) => quotes[Math.floor(Math.random() * quotes.length)]),
      switchMap(quote => formatQuote(quote, message)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('It seems this server has no quotes saved yet. Type *!addquote* to see how to add one.', message, client))
    ))
  }


  /**
   * Get Quote Help
   */

  private _getQuoteHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');
    
    const embed = new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL()
      })
      .setTitle(`${peepoSmart} TrashBot Quote Help ${peepoSmart}`)
      .setFields([
        {
          name: 'Commands',
          value: `
            **!quote**
            Shows a random quote stored on this server.

            **!quote -h**
            Shows the quote help panel (this one right here).

            **!quotelist**
            Shows the quotelist of the server.
            
            **!quote <quote_index>**
            Ex: *!quote 1*
            Shows a specific quote based on it's index.

            **!quote <quote_text>**
            Ex: *!quote Macaco*
            Shows a random quote which contains the specified quote text.
          `,
        },
      ]);

    return defer(() => from(message.channel.send({
      embeds: [embed]
    })))
  }


  /**
   * Get Quote List
   */

  private _getQuoteList(message: Message, client: Client) {
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
      map(({ data: { data: { findAllQuotes: quotes } } }) => this._createQuoteList(quotes, message)),
      switchMap(quoteList => this._formatQuoteList(quoteList, client, message)),
      catchError(err => sendError('It seems this server has no quotes saved yet. Type *!addquote* to see how to add one.', message, client))
    ))
  }


  private _createQuoteList(quotes, message: Message): string[] {
    return quotes.map(quote => {
      const author = message.guild.members.cache.find(member => member.user.id === quote.authorID);

      return `#${quote.indexNum}: ${quote.quote} - ${author?.nickname ?? author?.user.username} - ${new Date(quote.createdAt).toLocaleDateString()}`;
    })
  }

  private _formatQuoteList(quoteList: string[], client: Client, message: Message) {
    const pagedQuoteList = this._getPagedQuoteList(quoteList, []);

    return pagedQuoteList.map(pagedQuotes => {
      return message.author.send(`\`\`\`*** ${message.guild.name.toUpperCase()} QUOTE LIST *** \n \n \n${pagedQuotes.join('\n\n')}\`\`\``);
    })
  }

  private _getPagedQuoteList(quoteList: string[], pagedQuotes: string[][]): string[][] {
    let charCount = 0;

    const newPagedQuotes = quoteList.filter(quoteEntry => {
      return (charCount += quoteEntry.length) <= 1900
    })

    const remainingQuoteList = quoteList.slice(
      quoteList.findIndex(quoteEntry => (
        quoteEntry === newPagedQuotes[newPagedQuotes.length - 1]
      )) + 1
    )

    return remainingQuoteList.length
      ? this._getPagedQuoteList(remainingQuoteList, pagedQuotes.concat([newPagedQuotes]))
      : pagedQuotes.concat([newPagedQuotes]);
  }

  /**
   * Get Quote Count
   */

  private _getQuoteCount(message: Message, client: Client) {
    const countTarget = message.mentions.members.first() ?? null;

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
      map(({ data: { data: { findAllQuotes: quotes } } }) => ({
        allQuotes: quotes,
        userQuotes: quotes.filter(quote => quote.authorID === countTarget.id)
      })),
      switchMap(({ allQuotes, userQuotes }) => this._sendQuoteCount(
        message,
        allQuotes,
        userQuotes,
        countTarget
      )),
      catchError(err => sendError('It seems this server has no quotes saved yet. Type *!addquote* to see how to add one.', message, client))
    ))
  }

  private _sendQuoteCount(
    message: Message,
    allQuotes: string[],
    userQuotes: string[],
    countTarget: GuildMember
  ) {
    const quoteLiteral = userQuotes.length > 1 ? "quotes" : "quote";
    const quotePercentage = (((userQuotes.length) * 100) / (allQuotes.length)).toFixed(2);

    const embedQuoteCount = new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: countTarget.displayName,
        iconURL: countTarget.user.avatarURL()
      })
      .setFields([
        {
          name: 'Quotes Count',
          value: `${countTarget.displayName} has ${userQuotes.length} ${quoteLiteral} out of ${allQuotes.length}`,
        },
        {
          name: 'Quotes Percentage',
          value: `${countTarget.displayName} totalizes ${quotePercentage}% of this server's quotes`,
        },
      ]);

    return message.channel.send({
      embeds: [embedQuoteCount]
    });
  }
}