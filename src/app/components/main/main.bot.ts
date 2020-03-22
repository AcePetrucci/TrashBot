import { Client, Message, GuildChannel, TextChannel } from 'discord.js';
import { inject, injectable } from 'inversify';

import TYPES from '../../../config/types/types';

import { MessageHandler } from '../../core/services/message-handler/message-handler.service';
import { ReadyHandler } from '../../core/services/ready-handler/ready-handler.service';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@injectable()
export class TrashBot {

  private client: Client;
  private readonly token: string;
  private doujin: any;

  private messageHandler: MessageHandler;
  private readyHandler: ReadyHandler;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageHandler) messageHandler: MessageHandler,
    @inject(TYPES.ReadyHandler) readyHandler: ReadyHandler,
    @inject(TYPES.DoujinUrl) doujin: any
  ) {
    this.client = client;
    this.token = token;
    this.messageHandler = messageHandler;
    this.readyHandler = readyHandler;
    this.doujin = doujin;
  }

  public listen(): Promise<string> {


    /**
     * Listen to messages
     */

    this.client.on('message', (message: Message) => {
      if (message.author.bot) { return false; }

      setTimeout(() => {
        this.messageHandler.handleMessage(message, this.client).pipe(
          catchError(err => of(err))
        ).subscribe();
      }, 1500);
    });


    /**
     * Listen to ready
     */

    this.client.on('ready', () => {
      this.client.user.setActivity('POGGIES');

      setTimeout(() => {
        this.readyHandler.handleReady(this.client).subscribe();
      }, 1500);
    })


    /**
     * Login
     */

    return this.client.login(this.token);
  }

}