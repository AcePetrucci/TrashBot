import { CommandInteractionOption, Message } from "discord.js";

import { defer, from, Observable, of } from "rxjs"
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  IQuote,
  MessageInteraction
} from "shared/models"

import {
  formatQuote,
  formatEmbed,
  interactionDeferEmbed,
  interactionEditReplyEmbed,
  editErrorEmbed
} from "shared/utils";


/**
 * Get Quotes By Index Event
 */

export const getQuotesByIndexEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;
  let _quoteDeferMessage: void | Message<boolean>;


  /**
   * Get Quote By Index
   */

  const getQuoteByIndex = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
    options?: CommandInteractionOption[],
  ) => {
    const quoteIndex = options
      ? options.find(({name}) => name === 'quote-index').value as string
      : interaction.content.split(' ')[1];

    return defer(() => interactionDeferEmbed('Retrieving quote...', interaction, client)).pipe(
      tap(deferredInteraction => _quoteDeferMessage = deferredInteraction),
      switchMap(_ => _fetchQuoteByIndex(+quoteIndex, guildID)),
      switchMap(quote => formatQuote(quote, interaction, client)),
      switchMap(quoteData => of(formatEmbed(quoteData, client))),
      switchMap(quoteEmbed => interactionEditReplyEmbed(quoteEmbed, interaction, _quoteDeferMessage)),
      catchError(err => editErrorEmbed('It seems there is no quote with this index.', interaction, client, _quoteDeferMessage))
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