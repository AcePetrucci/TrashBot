import { from, Observable, zip } from "rxjs"
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  IQuote,
  MessageInteraction
} from "shared/models"

import {
  formatQuote,
  editListMessage,
  convertToList,
  generateList,
  interactionHandler
} from "shared/utils";


/**
 * Get Quotes List Event
 */

export const getQuotesListEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Get Quote List
   */

  const getQuoteList = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
  ) => {
    const {
      interactionDeferEmbed,
      interactionErrorEditReply,
      quoteDeferredMessage
    } = interactionHandler(interaction, client);

    return interactionDeferEmbed('Generating the list of quotes from this server...').pipe(
      switchMap(() => _fetchAllQuotes(guildID)),
      switchMap(quotes => zip(quotes.map(quote => formatQuote(quote, interaction, client)))),
      switchMap(quotesData => convertToList(quotesData)),
      map(quoteList => generateList(quoteList, 'Quotes', interaction)),
      map(quoteListFile => editListMessage(quoteListFile, 'Quotes', interaction, client, quoteDeferredMessage)),
      catchError(err => interactionErrorEditReply('Could not generate the list of quotes'))
    )
  }


  /**
   * Fetch Quotes
   */

  const _fetchAllQuotes = (guildID: string): Observable<IQuote[]> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findAllQuotes(guildID: "${guildID}") {
          authorID,
          quote,
          indexNum,
          createdAt,
          deleted
        }
      }`,
    })).pipe(
      map(({data: {data: {findAllQuotes: quotes}}}) => quotes)
    );
  }


  /**
   * Return Get Quote List
   */

  return { getQuoteList };
}