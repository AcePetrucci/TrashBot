import { CommandInteractionOption } from "discord.js";

import { from, Observable } from "rxjs"
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import axios from "axios";

import { IClient, MessageInteraction } from "shared/models"

import {
  setEmbedData,
  formatEmbed,
} from 'shared/utils';

import { interactionHandler } from 'bot/handlers';


/**
 * Delete Quote Event
 */

export const deleteQuoteEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Delete Quote
   */

  const deleteQuote = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
    options?: CommandInteractionOption[],
  ) => {
    const {
      deferEmbed,
      editReplyEmbed,
      errorEditReply,
    } = interactionHandler(interaction, client);

    const quoteIndex = options
      ? options.find(({name}) => name === 'quote-index').value as number
      : +interaction.content.split(' ').slice(1)[0];

    return deferEmbed('Deleting quote...').pipe(
      switchMap(_ => _deleteQuote(quoteIndex, guildID)),
      map(quoteIndex => setEmbedData(`Quote #${quoteIndex} has been deleted`, client, interaction)),
      map(quote => formatEmbed(quote, client)),
      switchMap(quoteEmbed => editReplyEmbed(quoteEmbed)),
      catchError(err => errorEditReply('Could not delete quote. Maybe you messed up the command?'))
    )
  }


  /**
   * Delete Quote And Return The Index
   */

  const _deleteQuote = (
    quoteIndex: number,
    guildID: string
  ): Observable<number> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `mutation {
        deleteByIndexNumQuote(
          guildID: "${guildID}", 
          indexNum: ${quoteIndex}
        ) {
          indexNum
        }
      }`,
    })).pipe(
      map(({data: {data: {deleteByIndexNumQuote: quote}}}) => quote.indexNum),
    );
  }


  /**
   * Return Delete Quote
   */

  return { deleteQuote };
}