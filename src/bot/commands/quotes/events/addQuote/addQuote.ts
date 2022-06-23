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
      deferEmbed,
      editReplyEmbed,
      errorEditReply,
      errorReply
    } = interactionHandler(interaction, client);

    const { formatQuote } = quoteHandler(interaction, client);

    const quoteText = options
      ? options.find(({name}) => name === 'quote-text').value as string
      : interaction.content.split(' ').slice(1, -2).join(' ');

    const quoteAuthor = options
      ? options.find(({name}) => name === 'quote-author').value as string
      : interaction.mentions.members?.first()?.id ?? interaction.author.id;

    if (!quoteText) {
      return errorReply('Could not add quote. Maybe you messed up the command?');
    }

    return deferEmbed('Adding quote...').pipe(
      switchMap(_ => _addQuote(quoteText, quoteAuthor, guildID)),
      switchMap(quote => formatQuote(quote)),
      switchMap(quoteEmbed => editReplyEmbed(quoteEmbed)),
      catchError(err => errorEditReply('Could not add quote. Maybe you messed up the command?'))
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