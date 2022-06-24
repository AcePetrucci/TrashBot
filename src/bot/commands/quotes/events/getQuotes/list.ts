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
  listHandler,
  quoteHandler
} from 'bot/handlers';


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
      deferEmbed,
      errorEditReply,
      interactionInstance
    } = interactionHandler(interaction, client);

    const {
      listEditReply,
      prepareList
    } = listHandler(interaction, client, 'Quotes', interactionInstance);

    const { setQuoteData } = quoteHandler(interaction, client);

    return deferEmbed('Generating the list of quotes from this server...').pipe(
      switchMap(() => _fetchAllQuotes(guildID)),
      switchMap(quotes => prepareList(quotes, setQuoteData)),
      map(quoteListFile => listEditReply(quoteListFile)),
      catchError(err => errorEditReply('Could not generate the list of quotes'))
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