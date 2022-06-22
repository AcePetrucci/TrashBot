import { CommandInteractionOption } from "discord.js";

import { from, Observable, of } from "rxjs"
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
  interactionHandler
} from "shared/utils";


/**
 * Add Quote Event
 */

export const addQuoteEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;


  /**
   * Add Quote
   */

  const addQuote = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
    options?: CommandInteractionOption[],
  ) => {
    const {
      interactionDeferEmbed,
      interactionEditReplyEmbed,
      interactionErrorEditReply
    } = interactionHandler(interaction, client);

    const quoteText = options
      ? options.find(({name}) => name === 'quote-text').value as string
      : interaction.content.split(' ').slice(1).join(' ');

    const quoteAuthor = options
      ? options.find(({name}) => name === 'quote-author').value as string
      : quoteText.split(' - ').slice(1)[0];

    return interactionDeferEmbed('Adding quote...').pipe(
      switchMap(_ => _addQuote(quoteText, quoteAuthor, guildID)),
      switchMap(quote => formatQuote(quote, interaction, client)),
      switchMap(quoteData => of(formatEmbed(quoteData, client))),
      switchMap(quoteEmbed => interactionEditReplyEmbed(quoteEmbed)),
      catchError(err => interactionErrorEditReply('Could not add quote. Maybe you messed up the command?'))
    )
  }


  /**
   * Add Quote And Return it
   */

  const _addQuote = (
    quoteText: string,
    quoteAuthor: string,
    guildID: string
  ): Observable<IQuote> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `mutation {
        createQuote(quote: {
          authorID: "${quoteAuthor}",
          guildID: "${guildID}",
          quote: "${quoteText}"
        }) {
          quote,
          authorID,
          createdAt,
          indexNum
        }
      }`,
    })).pipe(
      map(({data: {data: {createQuote: quote}}}) => quote)
    );
  }


  /**
   * Return Add Quote
   */

  return { addQuote };
}