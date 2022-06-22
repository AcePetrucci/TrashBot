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
 * Get Quotes By Text Event
 */

export const getQuotesByTextEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;
  const _random = (length: number) => Math.floor(Math.random() * length);

  let _quoteDeferMessage: void | Message<boolean>;


  /**
   * Get Quote By Text
   */

  const getQuoteByText = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
    options?: CommandInteractionOption[],
  ) => {
    const quoteText = options
      ? options.find(({name}) => name === 'quote-text').value as string
      : interaction.content.split(' ').slice(1).join(' ');

    return defer(() => interactionDeferEmbed('Retrieving quote...', interaction, client)).pipe(
      tap(deferredInteraction => _quoteDeferMessage = deferredInteraction),
      switchMap(_ => _fetchQuoteByText(quoteText, guildID)),
      switchMap(quote => formatQuote(quote, interaction, client)),
      switchMap(quoteData => of(formatEmbed(quoteData, client))),
      switchMap(quoteEmbed => interactionEditReplyEmbed(quoteEmbed, interaction, _quoteDeferMessage)),
      catchError(err => editErrorEmbed('Could not find any quotes with the given quote text piece', interaction, client, _quoteDeferMessage))
    )
  }


  /**
   * Fetch A Quote By Text
   */

  const _fetchQuoteByText = (
    quoteText: string,
    guildID: string
  ): Observable<IQuote> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findQuotes(quoteText: "${quoteText}", guildID: "${guildID}") {
          authorID,
          quote,
          indexNum,
          createdAt,
          deleted
        }
      }`,
    })).pipe(
      map(({data: {data: {findQuotes: quotes}}}) => quotes[_random(quotes.length)])
    );
  }


  /**
   * Return Get Quote By Text
   */

  return { getQuoteByText };
}