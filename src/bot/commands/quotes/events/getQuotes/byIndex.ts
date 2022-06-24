import { CommandInteractionOption } from "discord.js";

import { from, Observable } from "rxjs"
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  IQuote,
  MessageInteraction
} from "shared/models"

import {
  interactionHandler,
  quoteHandler
} from 'bot/handlers';


/**
 * Get Quotes By Index Event
 */

export const getQuotesByIndexEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Get Quote By Index
   */

  const getQuoteByIndex = (
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

    const { formatQuote } = quoteHandler(interaction, client);

    const quoteIndex = options
      ? options.find(({name}) => name === 'quote-index').value as number
      : +interaction.content.split(' ')[1];

    return deferEmbed('Retrieving quote...').pipe(
      switchMap(() => _fetchQuoteByIndex(quoteIndex, guildID)),
      switchMap(quote => formatQuote(quote)),
      switchMap(quoteEmbed => editReplyEmbed(quoteEmbed)),
      catchError(err => errorEditReply('It seems there is no quote with this index.'))
    )
  }


  /**
   * Fetch A Quote By Index
   */

  const _fetchQuoteByIndex = (
    quoteIndex: number,
    guildID: string
  ): Observable<IQuote> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findQuoteByIndexNum(indexNum: ${quoteIndex}, guildID: "${guildID}") {
          authorID,
          quote,
          indexNum,
          createdAt,
          deleted
        }
      }`,
    })).pipe(
      map(({data: {data: {findQuoteByIndexNum: quote}}}) => quote)
    );
  }


  /**
   * Return Get Quote By Index
   */

  return { getQuoteByIndex };
}