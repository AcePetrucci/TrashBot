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
 * Get Quotes By Text Event
 */

export const getQuotesByTextEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;
  const _random = (length: number) => Math.floor(Math.random() * length);


  /**
   * Get Quote By Text
   */

  const getQuoteByText = (
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

    const quoteText = options
      ? options.find(({name}) => name === 'quote-text').value as string
      : interaction.content.split(' ').slice(1).join(' ');

    return deferEmbed('Retrieving quote...').pipe(
      switchMap(_ => _fetchQuoteByText(quoteText, guildID)),
      switchMap(quote => formatQuote(quote)),
      switchMap(quoteEmbed => editReplyEmbed(quoteEmbed)),
      catchError(err => errorEditReply('Could not find any quotes with the given quote text piece'))
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