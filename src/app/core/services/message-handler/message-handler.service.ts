import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer } from 'rxjs';

import { NhCommandsService } from '../commands/nh/nh-commands.service';
import { ScreamCommandsService } from '../commands/scream/scream-commands.service';

import { QuoteCommandsService } from '../commands/quote/quote-commands.service';
import { AddQuoteCommandsService } from '../commands/addquote/addquote-commands.service';

@injectable()
export class MessageHandler {

  private _quoteCommandsServices: QuoteCommandsService;
  private _addQuoteCommandsServices: AddQuoteCommandsService;
  private _screamCommandsService: ScreamCommandsService;
  private _nhCommandsService: NhCommandsService;

  constructor(
    @inject(TYPES.ScreamCommandsService) screamCommandsService: ScreamCommandsService,
    @inject(TYPES.NhCommandsService) nhCommandsService: NhCommandsService,
    @inject(TYPES.QuoteCommandsService) quoteCommandsService: QuoteCommandsService,
    @inject(TYPES.AddQuoteCommandsService) addQuoteCommandsService: AddQuoteCommandsService,
  ) {
    this._screamCommandsService = screamCommandsService;
    this._nhCommandsService = nhCommandsService;
    this._quoteCommandsServices = quoteCommandsService;
    this._addQuoteCommandsServices = addQuoteCommandsService;
  }


  /**
   * Message Handling Central
   */
  
  handleMessage(message: Message, client: Client): Observable<Message | Message[]> {
    switch (true) {
      case message.content.includes('!scream'):
        return this._screamCommandsService.screamCommands(message, client);

      case message.content.includes('!nh'):
        return this._nhCommandsService.nhCommands(message, client);

      case message.content.includes('!quote'):
        return this._quoteCommandsServices.showQuoteCommands(message, client);

      case message.content.includes('!addquote'):
        return this._addQuoteCommandsServices.addQuoteCommands(message, client);

      default:
        return defer(() => from(Promise.reject()));

    }
  }

}