import { Message, Client, MessageEmbed } from 'discord.js';
import { injectable, inject } from 'inversify';
import axios from 'axios';

import { from, defer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import {
  findEmoji,
  formatQuote,
  sendQuote,
  sendError
} from 'shared/utils';

import { TYPES } from 'shared/config/types';

@injectable()
export class AddQuoteCommands {

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
      switchMap(({ data: { data: { createQuote: quote } } }) => formatQuote(`Quote #${quote.indexNum} has been created.`)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('Could not create the quote. Are you sure you followed the guidelines?', message, client))
    ));
  }


  /**
   * Add Quote Help
   */

  private _addQuoteHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    const embed = new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL()
      })
      .setTitle(`${peepoSmart} TrashBot AddQuote Help ${peepoSmart}`)
      .setFields([
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
      ]);

    return defer(() => from(message.channel.send({
      embeds: [embed]
    })))
  }

}