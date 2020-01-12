import { Message, Client } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer } from 'rxjs';

import { TrashCommandsService } from '../commands/trash/trash-commands.service';
import { NhCommandsService } from '../commands/nh/nh-commands.service';

@injectable()
export class MessageHandler {

  private _trashCommandsService: TrashCommandsService;
  private _nhCommandsService: NhCommandsService;

  constructor(
    @inject(TYPES.TrashCommandsService) trashCommandsService: TrashCommandsService,
    @inject(TYPES.NhCommandsService) nhCommandsService: NhCommandsService
  ) {
    this._trashCommandsService = trashCommandsService;
    this._nhCommandsService = nhCommandsService;
  }


  /**
   * Message Handling Central
   */
  
  handleMessage(message: Message, client: Client): Observable<Message | Message[]> {
    switch (true) {
      case message.content.includes('!trash'):
        return this._trashCommandsService.trashCommands(message, client);

      case message.content.includes('!nh'):
        return this._nhCommandsService.nhCommands(message, client);

      default:
        return defer(() => from(Promise.reject()));

    }
  }

}