import { Client, Message } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from 'shared/config/types';

import { MessageHandlerEvents, ReadyHandlerEvents } from 'bot/events';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@injectable()
export class TrashBot {

  private client: Client;
  private readonly token: string;

  private messageHandlerEvents: MessageHandlerEvents;
  private readyHandlerEvents: ReadyHandlerEvents;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageHandlerEvents) messageHandlerEvents: MessageHandlerEvents,
    @inject(TYPES.ReadyHandlerEvents) readyHandlerEvents: ReadyHandlerEvents,
    @inject(TYPES.DoujinUrl) doujin: any
  ) {
    this.client = client;
    this.token = token;
    this.messageHandlerEvents = messageHandlerEvents;
    this.readyHandlerEvents = readyHandlerEvents;
  }

  public listen(): Promise<string> {


    /**
     * Listen to messages
     */

    this.client.on('messageCreate', (message: Message) => {
      if (message.author.bot) { return; }

      setTimeout(() => {
        this.messageHandlerEvents.handleMessage(message, this.client).pipe(
          catchError(err => of(err))
        ).subscribe();
      }, 1500);
    });


    /**
     * Listen to ready
     */

    this.client.on('ready', () => {
      this.client.user.setActivity('!trash or !trash -h');

      setTimeout(() => {
        this.readyHandlerEvents.handleReady(this.client).subscribe();
      }, 1500);
    })

    this.client.on('error', error => {
      console.error('Websocket connection error');
    })


    /**
     * Login
     */

    return this.client.login(this.token);
  }

}