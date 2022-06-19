import { Message } from 'discord.js';
import { catchError, of } from 'rxjs';

import { IClient, ILegacyCommand } from 'shared/models';

export const messageCreateEvent = (
  client: IClient
) => {


  /**
   * Client Message Create
   */
  
  const clientMessageCreate = () => {
    client.on('messageCreate', (message: Message) => {
      if (message.author.bot) { return; }
      if (!message.content.startsWith('!')) { return; }

      const command = client.legacyCommands.get(message.content.split(' ')[0]) as ILegacyCommand;

      command.trigger(message, client).pipe(
        catchError(err => of(err))
      ).subscribe();
    })
  };


  /**
   * Return Event
   */

  return { clientMessageCreate };
}