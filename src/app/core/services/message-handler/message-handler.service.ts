import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import TYPES from '../../../../config/types/types';

import { Observable, from, defer } from 'rxjs';

import { NhCommandsService } from '../commands/nh/nh-commands.service';
import { ScreamCommandsService } from '../commands/scream/scream-commands.service';
import { AsciiCommandsService } from '../commands/ascii/ascii-commands.service';

import { QuoteCommandsService } from '../commands/quote/quote-commands.service';
import { AddQuoteCommandsService } from '../commands/addquote/addquote-commands.service';

import { CustomCommandsService } from '../commands/custom/custom-commands.service';

import { findEmoji } from '../../../utils/emojis/emojis';

@injectable()
export class MessageHandler {

  private _quoteCommandsServices: QuoteCommandsService;
  private _addQuoteCommandsServices: AddQuoteCommandsService;
  private _screamCommandsService: ScreamCommandsService;
  private _nhCommandsService: NhCommandsService;
  private _asciiCommandsService: AsciiCommandsService;
  private _customCommandsService: CustomCommandsService;

  constructor(
    @inject(TYPES.ScreamCommandsService) screamCommandsService: ScreamCommandsService,
    @inject(TYPES.NhCommandsService) nhCommandsService: NhCommandsService,
    @inject(TYPES.QuoteCommandsService) quoteCommandsService: QuoteCommandsService,
    @inject(TYPES.AddQuoteCommandsService) addQuoteCommandsService: AddQuoteCommandsService,
    @inject(TYPES.AsciiCommandsService) asciiCommandsService: AsciiCommandsService,
    @inject(TYPES.CustomCommandsService) customCommandsService: CustomCommandsService,
  ) {
    this._screamCommandsService = screamCommandsService;
    this._nhCommandsService = nhCommandsService;
    this._quoteCommandsServices = quoteCommandsService;
    this._addQuoteCommandsServices = addQuoteCommandsService;
    this._asciiCommandsService = asciiCommandsService;
    this._customCommandsService = customCommandsService;
  }


  /**
   * Message Handling Central
   */

  handleMessage(message: Message, client: Client): Observable<Message | Promise<Message>> {
    switch (true) {
      case message.content.includes('!scream'):
        return this._screamCommandsService.screamCommands(message, client);

      case message.content.includes('!nh'):
        return this._nhCommandsService.nhCommands(message, client);

      case message.content.includes('!quote'):
        return this._quoteCommandsServices.showQuoteCommands(message, client);

      case message.content.includes('!quotelist'):
        return this._quoteCommandsServices.showQuoteCommands(message, client);

      case message.content.includes('!addquote'):
        return this._addQuoteCommandsServices.addQuoteCommands(message, client);

      case message.content.includes('!ascii'):
        return this._asciiCommandsService.asciiCommands(message, client);

      case message.content.includes('!addcommand'):
        return this._customCommandsService.addCustomCommandsHandler(message, client);

      case (message.content.includes('!trash') || message.content.includes('!trash -h')):
        return this._trashHelp(message, client);

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

    return defer(() => from(message.channel.send({
      embed: {
        color: 0xec407a,
        author: {
          name: client.user.username,
          iconURL: client.user.avatarURL()
        },
        title: `${peepoSmart} TrashBot Help ${peepoSmart}`,
        fields: [
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
        ]
      }
    })))
  }

}