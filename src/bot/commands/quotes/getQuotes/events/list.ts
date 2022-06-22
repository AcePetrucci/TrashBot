import { Message } from "discord.js";
import { defer, from, Observable, zip } from "rxjs"
import { map, switchMap, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  IQuote,
  MessageInteraction
} from "shared/models"

import {
  formatQuote,
  interactionDeferEmbed,
  editListMessage,
  convertToList,
  generateList
} from "shared/utils";


/**
 * Get Quotes List Event
 */

export const getQuotesListEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;
  let _quoteListMessage: void | Message<boolean>;


  /**
   * Get Quote List
   */

  const getQuoteList = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
  ) => {
    return defer(() => interactionDeferEmbed('Generating the list of quotes from this server...', interaction, client)).pipe(
      tap(deferredInteraction => _quoteListMessage = deferredInteraction),
      switchMap(() => _fetchAllQuotes(guildID)),
      switchMap(quotes => zip(quotes.map(quote => formatQuote(quote, interaction, client)))),
      switchMap(quotesData => convertToList(quotesData)),
      map(quoteList => generateList(quoteList, 'Quotes', interaction)),
      map(quoteListFile => editListMessage(quoteListFile, 'Quotes', interaction, client, _quoteListMessage))
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