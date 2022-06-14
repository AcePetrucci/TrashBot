import { Message, Client, MessageEmbed } from 'discord.js';
import { inject, injectable } from 'inversify';

import TYPES from '../../../../../config/types/types';

import { from, defer } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

import { DoujinFinderService } from '../../doujin-finder/doujin-finder.service';

import { findEmoji } from '../../../../utils/emojis/emojis';
import { formatQuote, sendQuote } from '../../../../utils/quotes/quotes';
import { sendError } from '../../../../utils/errors/errors';

import axios from 'axios';

@injectable()
export class NhCommandsService {

  private _doujinFinderService: DoujinFinderService;
  private readonly _quoteAPIUrl: string;

  private _findEmoji;
  private _lastSentMessage = '';
  private _guildID: string;

  constructor(
    @inject(TYPES.DoujinFinderService) doujinFinderService: DoujinFinderService,
    @inject(TYPES.QuoteAPIUrl) quoteAPIUrl: string
  ) {
    this._doujinFinderService = doujinFinderService;
    this._quoteAPIUrl = quoteAPIUrl;
  }


  /**
   * NH Commands Central
   */

  nhCommands(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);
    this._lastSentMessage = message.content.toLowerCase();

    this._guildID = message.guild.id;

    switch (true) {
      case this._lastSentMessage === '!nh -h':
        return this._nhHelp(message, client);

      case (this._lastSentMessage === '!nh' || this._lastSentMessage.includes('tag')):
        return this._nhRandomTag(message);

      case this._lastSentMessage === '!nh disable':
        return this._nhToggle(message, client, true);

      case this._lastSentMessage === '!nh enable':
        return this._nhToggle(message, client, false);

      case this._lastSentMessage.startsWith('!nh timer'):
        return this._nhRandomTag(message);

      default:
        return this._nhDoujinByTag(message);
    }
  }


  /**
   * NH Help
   */

  private _nhHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    const embed = new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL()
      })
      .setTitle(`${peepoSmart} TrashBot NH Help ${peepoSmart}`)
      .setFields([
        {
          name: 'Commands',
          value: `
            **!nh**
            Search for a random NH tag and return it's page.
            
            **!nh <tag_names>**
            Ex: *!nh yuri english*
            Search for a specific tag and return a random doujin which contains the specified tag(s).

            **!nh disable**
            Disables the !nh auto timer, preventing the bot of sending random nh at any given amount of time.

            **!nh enable**
            Enables the !nh auto timer, allowing the bot of sending random nh at any given amount of time.
          `,
        },
      ]);

    return defer(() => from(message.channel.send({
      embeds: [embed]
    })))
  }


  /**
   * NH Random Tag
   */

  private _nhRandomTag(message: Message) {
    return defer(() => from(message.channel.send(this._doujinFinderService.findTagPage())));
  }


  /**
   * NH Doujin by Tag
   */

  private _nhDoujinByTag(message: Message) {
    const tag = this._lastSentMessage.slice(4);
    const ayaya = this._findEmoji('AYAYA');

    return defer(() => this._doujinFinderService.findDoujinByTag(tag).pipe(
      switchMap(doujin => message.channel.send(doujin)),
      catchError(err => message.channel.send(`${ayaya} It seems your tag search doesn't exist ${ayaya}`))
    ));
  }

  /**
   * NH Toggle
   */

  private _nhToggle(message: Message, client: Client, disabled: boolean) {
    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `mutation {
        toggleNh(guildID: "${this._guildID}", disabled: ${disabled}) {
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      switchMap(({ data: { data: { toggleNh: serverConfig } } }) => formatQuote(`This server has ${disabled ? 'disabled' : 'enabled'} the !nh timer`)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('Could not update the server config.', message, client))
    ));
  }
}