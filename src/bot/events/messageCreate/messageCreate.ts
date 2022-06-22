import { Message } from 'discord.js';
import { catchError, of } from 'rxjs';

import { IClient, ILegacyCommand } from 'shared/models';

export const messageCreateEvent = (
  client: IClient
) => {

  const literallyMe = process.env.ME;
  const developmentMode = process.env.DEV;

  /**
   * Client Message Create
   */
  
  const clientMessageCreate = () => {
    client.on('messageCreate', (message: Message) => {
      if (message.author.bot) { return; }
      if (!message.content.startsWith('!')) { return; }

      if (developmentMode && message.author.id !== literallyMe) {
        message.channel.send({embeds: [{
          image: {url: 'https://i.pinimg.com/474x/3a/06/4c/3a064c28f605779a453ff39f74eb3b22.jpg'}
        }]});

        return;
      }

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