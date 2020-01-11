import { Client, Message } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../config/typings/types';

import { logMessage } from '../../utils/logger/logger';

// import { MessageHandler } from 'src/app/core/services/message-handler';

@injectable()
export class TrashBot {
  private client: Client;
  private readonly token: string;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string
  ) {
    this.client = client;
    this.token = token;
  }

  public listen(): Promise<string> {
    this.client.on('message', (message: Message) => {
      logMessage(message);

      if (message.author.bot) { return false; }
    });

    return this.client.login(this.token);
  }
}