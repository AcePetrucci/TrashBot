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
 * Add Custom Command Event
 */

export const addCustomCommandEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Add Custom Command
   */

  const addCustomCommand = (
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

    const authorID = interaction.member.id;

    const commandName = options
      ? options.find(({name}) => name === 'command-name').value as string
      : interaction.content.split(' ')[1];

    const commandText = options
      ? options.find(({name}) => name === 'command-text').value as string
      : interaction.content.split(' - ')[1];

    if (!commandName) {
      return errorReply('Could not add the custom command. Maybe you messed up?');
    }

    return deferEmbed('Adding command...').pipe(
      switchMap(_ => _addCustomCommand(commandName, commandText, guildID, authorID)),
      map(command => formatCustom(command)),
      switchMap(commandEmbed => editReplyEmbed(commandEmbed)),
      catchError(err => errorEditReply('Could not add the custom command. Maybe you messed up?'))
    )
  }


  /**
   * Add Custom Command And Return it
   */

  const _addCustomCommand = (
    commandName: string,
    commandText: string,
    guildID: string,
    authorID: string
  ): Observable<ICustom> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `mutation {
        createCommand(command: {
          authorID: "${authorID}",
          guildID: "${guildID}",
          commandName: "${commandName}",
          commandText: "${commandText}"
        }) {
          commandName,
          commandText,
          createdAt,
        }
      }`,
    })).pipe(
      map(({data: {data: {createCommand: command}}}) => command)
    );
  }


  /**
   * Return Add Command
   */

  return { addCustomCommand };
}