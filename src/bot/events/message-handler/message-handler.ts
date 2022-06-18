import { Message, Client, MessageEmbed } from 'discord.js';
import { inject, injectable } from 'inversify';

import { Observable, from, defer } from 'rxjs';

import { TYPES } from 'shared/config/types';

import {
  NhCommands,
  QuoteCommands,
  AddQuoteCommands,
  DeleteQuoteCommands,
  CustomCommands,
} from 'bot/commands';

// import { MusicCommandsService } from '../commands/music/music-commands.service';

import { findEmoji } from 'shared/utils';

@injectable()
export class MessageHandlerEvents {

  private _quoteCommands: QuoteCommands;
  private _addQuoteCommands: AddQuoteCommands;
  private _deleteQuoteCommands: DeleteQuoteCommands;
  private _nhCommands: NhCommands;
  private _customCommands: CustomCommands;
  // private _musicCommands: MusicCommands;

  constructor(
    @inject(TYPES.NhCommands) nhCommands: NhCommands,
    @inject(TYPES.QuoteCommands) quoteCommands: QuoteCommands,
    @inject(TYPES.AddQuoteCommands) addQuoteCommands: AddQuoteCommands,
    @inject(TYPES.DeleteQuoteCommands) deleteQuoteCommands: DeleteQuoteCommands,
    @inject(TYPES.CustomCommands) customCommands: CustomCommands,
    // @inject(TYPES.MusicCommands) musicCommands: MusicCommands,
  ) {
    this._nhCommands = nhCommands;
    this._quoteCommands = quoteCommands;
    this._addQuoteCommands = addQuoteCommands;
    this._deleteQuoteCommands = deleteQuoteCommands;
    this._customCommands = customCommands;
    // this._musicCommands = musicCommands;
  }


  /**
   * Message Handling Central
   */

  handleMessage(message: Message, client: Client): Observable<Message | Promise<Message> | void> {
    switch (true) {
      case message.content.startsWith('!nh'):
        return this._nhCommands.nhCommands(message, client);

      case message.content.startsWith('!quote'):
        return this._quoteCommands.showQuoteCommands(message, client);

      case message.content.startsWith('!quotelist'):
        return this._quoteCommands.showQuoteCommands(message, client);

      case message.content.startsWith('!addquote'):
        return this._addQuoteCommands.addQuoteCommands(message, client);

      case message.content.startsWith('!dquote'):
        return this._deleteQuoteCommands.deleteQuoteCommands(message, client);

      case message.content.startsWith('!addcommand'):
        return this._customCommands.addCustomCommandsHandler(message, client);

      case (message.content.startsWith('!trash') || message.content.startsWith('!trash -h')):
        return this._trashHelp(message, client);

      // case (message.content.startsWith('!play') || message.content.startsWith('!p ')):
      //   return this._musicCommands.musicCommands(message, client);

      // case (message.content.startsWith('!stop') || message.content === '!s'):
      //   return this._musicCommands.musicCommands(message, client);

      case message.content.startsWith('!'):
        return this._customCommands.getCustomCommandsHandler(message, client);

      default:
        return defer(() => from(Promise.reject()));

    }
  }


  /**
   * TrashHelp
   */

  private _trashHelp(message: Message, client: Client): Observable<Message> {
    const peepoSmart = findEmoji(client)('peepoSmart');

    const embed = new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL()
      })
      .setTitle(`${peepoSmart} TrashBot Help ${peepoSmart}`)
      .setFields([
        {
          name: 'TrashBot Help',
          value: `
            **!addquote -h**
            Shows the addquote help panel.

            **!quote -h**
            Shows the quote help panel.

            **!addcommand -h**
            Shows the custom commands help panel.

            **!nh -h**
            Shows the NH help panel.
          `,
        },
      ]);

    return defer(() => from(message.channel.send({
      embeds: [embed]
    })))
  }

}