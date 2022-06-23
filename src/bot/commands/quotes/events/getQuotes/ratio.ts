import {
  CommandInteractionOption,
  EmbedFieldData,
  GuildMember,
} from "discord.js";

import { from, Observable } from "rxjs"
import { catchError, map, switchMap, delay, tap } from 'rxjs/operators';

import axios from "axios";

import {
  IClient,
  IQuote,
  IQuoteRatio,
  MessageInteraction
} from "shared/models"

import {
  setEmbedRatioData,
  formatEmbedRatioData,
} from "shared/utils";

import {
  interactionHandler
} from 'bot/handlers';


/**
 * Get Quotes Ratio Event
 */

export const getQuotesRatioEvent = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;

  /**
   * Get Quote Ratio
   */

  const getQuoteRatio = (
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

    const author = options
      ? options.find(({name}) => name === 'quote-author').member as GuildMember
      : interaction.mentions.members.first();

    return deferEmbed('Retrieving quote ratio...').pipe(
      switchMap(() => _fetchAllQuotes(guildID)),
      map(quotes => _filterQuotes(quotes, author)),
      map(quoteRatio => _formatQuoteRatioMessage(quoteRatio)),
      map(quoteRatioFields => setEmbedRatioData(quoteRatioFields, author)),
      map(embedRatioData => formatEmbedRatioData(embedRatioData, client)),
      delay(500),
      switchMap(embedRatioMsg => editReplyEmbed(embedRatioMsg)),
      catchError(err => errorEditReply('Could not find any quotes for the mentioned user (or lack of)'))
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
   * Filter Quotes
   */

  const _filterQuotes = (
    quotes: IQuote[],
    author: GuildMember,
  ): IQuoteRatio => {

    return {
      allQuotes: quotes,
      userQuotes: quotes.filter(quote => quote.authorID === author.id),
      userName: author.displayName
    }
  }


  /**
   * Format Quote Ratio Embed
   */

  const _formatQuoteRatioMessage = (quoteRatio: IQuoteRatio) => {
    const quoteLiteral = quoteRatio.userQuotes.length > 1 ? "quotes" : "quote";
    const quotePercentage = (((quoteRatio.userQuotes.length) * 100) / (quoteRatio.allQuotes.length)).toFixed(2);

    const embedField: EmbedFieldData[] = [
      {
        name: 'Quotes Count',
        value: `${quoteRatio.userName} has ${quoteRatio.userQuotes.length} ${quoteLiteral} out of ${quoteRatio.allQuotes.length}`,
      },
      {
        name: 'Quotes Ratio',
        value: `${quoteRatio.userName} totalizes ${quotePercentage}% of this server's quotes`,
      },
    ];

    return embedField;
  }


  /**
   * Return Get Quote Ratio
   */

  return { getQuoteRatio };
}