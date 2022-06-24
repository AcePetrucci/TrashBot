import { CommandInteractionOption } from "discord.js";

import { from, Observable } from "rxjs"
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  ICustom,
  MessageInteraction
} from "shared/models"

import {
  interactionHandler,
  customHandler
} from 'bot/handlers';


/**
 * Delete Custom Command Event
 */

export const deleteCustomCommandEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Delete Custom Command
   */

  const deleteCustomCommand = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
    options?: CommandInteractionOption[],
  ) => {
    const {
      deferEmbed,
      editReplyEmbed,
      errorEditReply,
      errorReply
    } = interactionHandler(interaction, client);

    const { formatCustom } = customHandler(interaction, client);

    const commandName = options
      ? options.find(({name}) => name === 'command-name').value as string
      : interaction.content.split(' ')[1];

    if (!commandName) {
      return errorReply('Could not delete the custom command. Maybe you messed up?');
    }

    return deferEmbed('Deleting command...').pipe(
      switchMap(_ => _deleteCustomCommand(commandName, guildID)),
      map(command => formatCustom(command)),
      switchMap(commandEmbed => editReplyEmbed(commandEmbed)),
      catchError(err => errorEditReply('Could not delete the custom command. Maybe you messed up?'))
    )
  }


  /**
   * Delete Custom Command And Return it
   */

  const _deleteCustomCommand = (
    commandName: string,
    guildID: string,
  ): Observable<ICustom> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `mutation {
        deleteByNameCommand(
          guildID: "${guildID}",
          commandName: "${commandName}"
        ) {
          commandName
        }
      }`,
    })).pipe(
      map(({data: {data: {deleteByNameCommand: command}}}) => command),
    );
  }


  /**
   * Return Delete Command
   */

  return { deleteCustomCommand };
}