import { Message, Client, MessageEmbed } from 'discord.js';
import { inject, injectable } from 'inversify';

import TYPES from '../../../../config/types/types';

import { Observable, from, defer } from 'rxjs';

import { NhCommandsService } from '../commands/nh/nh-commands.service';

import { QuoteCommandsService } from '../commands/quote/quote-commands.service';
import { AddQuoteCommandsService } from '../commands/addquote/addquote-commands.service';
import { DeleteQuoteCommandsService } from '../commands/deletequote/deletequote-commands.service';

import { CustomCommandsService } from '../commands/custom/custom-commands.service';

// import { MusicCommandsService } from '../commands/music/music-commands.service';

import { findEmoji } from '../../../utils/emojis/emojis';

@injectable()
export class MessageHandler {

  private _quoteCommandsServices: QuoteCommandsService;
  private _addQuoteCommandsServices: AddQuoteCommandsService;
  private _deleteQuoteCommandsServices: DeleteQuoteCommandsService;
  private _nhCommandsService: NhCommandsService;
  private _customCommandsService: CustomCommandsService;
  // private _musicCommandsService: MusicCommandsService;

  constructor(
    @inject(TYPES.NhCommandsService) nhCommandsService: NhCommandsService,
    @inject(TYPES.QuoteCommandsService) quoteCommandsService: QuoteCommandsService,
    @inject(TYPES.AddQuoteCommandsService) addQuoteCommandsService: AddQuoteCommandsService,
    @inject(TYPES.DeleteQuoteCommandsService) deleteQuoteCommandsService: DeleteQuoteCommandsService,
    @inject(TYPES.CustomCommandsService) customCommandsService: CustomCommandsService,
    // @inject(TYPES.MusicCommandsService) musicCommandsService: MusicCommandsService,
  ) {
    this._nhCommandsService = nhCommandsService;
    this._quoteCommandsServices = quoteCommandsService;
    this._addQuoteCommandsServices = addQuoteCommandsService;
    this._deleteQuoteCommandsServices = deleteQuoteCommandsService;
    this._customCommandsService = customCommandsService;
    // this._musicCommandsService = musicCommandsService;
  }


  /**
   * Message Handling Central
   */

  handleMessage(message: Message, client: Client): Observable<Message | Promise<Message> | void> {
    switch (true) {
      case message.content.startsWith('!nh'):
        return this._nhCommandsService.nhCommands(message, client);

      case message.content.startsWith('!quote'):
        return this._quoteCommandsServices.showQuoteCommands(message, client);

      case message.content.startsWith('!quotelist'):
        return this._quoteCommandsServices.showQuoteCommands(message, client);

      case message.content.startsWith('!addquote'):
        return this._addQuoteCommandsServices.addQuoteCommands(message, client);

      case message.content.startsWith('!dquote'):
        return this._deleteQuoteCommandsServices.deleteQuoteCommands(message, client);

      case message.content.startsWith('!addcommand'):
        return this._customCommandsService.addCustomCommandsHandler(message, client);

      case (message.content.startsWith('!trash') || message.content.startsWith('!trash -h')):
        return this._trashHelp(message, client);

      // case (message.content.startsWith('!play') || message.content.startsWith('!p ')):
      //   return this._musicCommandsService.musicCommands(message, client);

      // case (message.content.startsWith('!stop') || message.content === '!s'):
      //   return this._musicCommandsService.musicCommands(message, client);

      case message.content.startsWith('!'):
        return this._customCommandsService.getCustomCommandsHandler(message, client);

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