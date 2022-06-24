import { CommandInteractionOption } from "discord.js";

import { from, Observable } from "rxjs"
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  MessageInteraction,
  ICustom
} from "shared/models"

import {
  interactionHandler,
  customHandler
} from 'bot/handlers';


/**
 * Get Custom Command Event
 */

export const getCustomCommandEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Get Custom Command
   */

  const getCustomCommand = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
    options?: CommandInteractionOption[],
  ) => {
    const {
      deferEmbed,
      editReplyEmbed,
      errorEditReply
    } = interactionHandler(interaction, client);

    const {
      formatCustom
    } = customHandler(interaction, client);

    const commandName = options
      ? options.find(({name}) => name === 'command-name').value as string
      : interaction.content.split('!')[1];

    return deferEmbed('Retrieving command...').pipe(
      switchMap(_ => _fetchCommand(commandName, guildID)),
      map(command => formatCustom(command)),
      switchMap(commandEmbed => editReplyEmbed(commandEmbed)),
      catchError(err => errorEditReply('Could not find any commands with the given command name'))
    )
  }


  /**
   * Fetch Command
   */

  const _fetchCommand = (
    commandName: string,
    guildID: string
  ): Observable<ICustom> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findCommand(commandName: "${commandName}", guildID: "${guildID}") {
          commandName,
          commandText,
          createdAt
        }
      }`,
    })).pipe(
      map(({data: {data: {findCommand: command}}}) => command)
    );
  }


  /**
   * Return Get Custom Command
   */

  return { getCustomCommand };
}