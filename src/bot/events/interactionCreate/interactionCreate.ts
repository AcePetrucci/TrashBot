import { Interaction } from 'discord.js';
import { catchError, of } from 'rxjs';

import { IClient, ISlashCommand } from 'shared/models';

export const interactionCreateEvent = (
  client: IClient
) => {


  /**
   * Client Interaction Create
   */
  
  const clientInteractionCreate = () => {
    client.on('interactionCreate', (interaction: Interaction) => {
      if (!interaction.isCommand()) { return; }

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