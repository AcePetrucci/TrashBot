import { from, Observable, of } from "rxjs"
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  IQuote,
  MessageInteraction
} from "shared/models"

import {
  formatQuote,
  formatEmbed,
  interactionHandler
} from "shared/utils";


/**
 * Get Quotes Random Event
 */

export const getQuotesRandomEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;
  const _random = (length: number) => Math.floor(Math.random() * length);


  /**
   * Get Random Quote
   */

  const getRandomQuote = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
  ) => {
    const {
      interactionDeferEmbed,
      interactionEditReplyEmbed,
      interactionErrorEditReply
    } = interactionHandler(interaction, client);

    return interactionDeferEmbed('Retrieving quote...').pipe(
      switchMap(() => _fetchRandomQuote(guildID)),
      switchMap(quote => formatQuote(quote, interaction, client)),
      switchMap(quoteData => of(formatEmbed(quoteData, client))),
      switchMap(quoteEmbed => interactionEditReplyEmbed(quoteEmbed)),
      catchError(err => interactionErrorEditReply('Could not find any quotes for this server'))
    )
  }


  /**
   * Fetch A Random Quote
   */

  const _fetchRandomQuote = (guildID: string): Observable<IQuote> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findAllQuotes(guildID: "${guildID}") {
          authorID,
          quote,
          indexNum,
          createdAt
        }
      }`,
    })).pipe(
      map(({data: {data: {findAllQuotes: quotes}}}) => quotes[_random(quotes.length)])
    );
  }


  /**
   * Return Get Random Quote
   */

  return { getRandomQuote };
}