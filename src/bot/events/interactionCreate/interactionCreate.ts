import { Interaction } from 'discord.js';
import { catchError, of } from 'rxjs';

import { IClient, ISlashCommand } from 'shared/models';

export const interactionCreateEvent = (
  client: IClient
) => {

  const literallyMe = process.env.ME;
  const developmentMode = process.env.DEV;

  /**
   * Client Interaction Create
   */
  
  const clientInteractionCreate = () => {
    client.on('interactionCreate', (interaction: Interaction) => {
      if (!interaction.isCommand()) { return; }

      if (developmentMode && interaction.user.id !== literallyMe) {
        interaction.reply({embeds: [{
          image: {url: 'https://i.pinimg.com/474x/3a/06/4c/3a064c28f605779a453ff39f74eb3b22.jpg'}
        }]});

        return;
      }

      const command = client.slashCommands.get(interaction.commandName) as ISlashCommand;

      if (!command) { return; }

      command.trigger(interaction, client).pipe(
        catchError(err => of(err))
      ).subscribe();
    })
  };


  /**
   * Return Event
   */

  return { clientInteractionCreate };
}