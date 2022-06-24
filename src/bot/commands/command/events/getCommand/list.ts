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
  listHandler,
  customHandler
} from 'bot/handlers';


/**
 * Get Custom Commands List Event
 */

export const getCustomCommandsListEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Get Custom Commands List
   */

  const getCustomCommandsList = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
  ) => {
    const {
      deferEmbed,
      errorEditReply,
      interactionInstance
    } = interactionHandler(interaction, client);

    const {
      listEditReply,
      prepareList
    } = listHandler(interaction, client, 'Commands', interactionInstance);

    const { setCustomListData } = customHandler(interaction, client);

    return deferEmbed('Generating the list of custom commands from this server...').pipe(
      switchMap(() => _fetchAllCustomCommands(guildID)),
      switchMap(commands => prepareList(commands, setCustomListData)),
      map(commandListFile => listEditReply(commandListFile)),
      catchError(err => errorEditReply('Could not generate the list of custom commands'))
    )
  }


  /**
   * Fetch Custom Commands
   */

  const _fetchAllCustomCommands = (guildID: string): Observable<ICustom[]> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findAllCommands(guildID: "${guildID}") {
          authorID,
          commandName,
          commandText,
          createdAt
        }
      }`,
    })).pipe(
      map(({data: {data: {findAllCommands: commands}}}) => commands)
    );
  }


  /**
   * Return Get Custom Commands List
   */

  return { getCustomCommandsList };
}