import { Client, Message, GuildChannel, TextChannel } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../config/typings/types';

import { logMessage } from '../../utils/logger/logger';

import { MessageHandler } from '../../core/services/message-handler/message-handler.service';
import { ReadyHandler } from '../../core/services/ready-handler/ready-handler.service';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@injectable()
export class TrashBot {

  private client: Client;
  private readonly token: string;

  private messageHandler: MessageHandler;
  private readyHandler: ReadyHandler;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageHandler) messageHandler: MessageHandler,
    @inject(TYPES.ReadyHandler) readyHandler: ReadyHandler
  ) {
    this.client = client;
    this.token = token;
    this.messageHandler = messageHandler;
    this.readyHandler = readyHandler;
  }

  public listen(): Promise<string> {
    this.client.on('message', (message: Message) => {
      logMessage(message);

      if (message.author.bot) { return false; }

      setTimeout(() => {
        this.messageHandler.handleMessage(message, this.client).pipe(catchError(err => of(err))).subscribe();
      }, 1500);
    });

    this.client.on('ready', () => {
      setTimeout(() => {
        this.readyHandler.handleReady(this.client).subscribe();
      }, 1500);
    })

    return this.client.login(this.token);
  }

}