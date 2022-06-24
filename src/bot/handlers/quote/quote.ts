import { memoize } from 'lodash/fp';

import {
  IClient,
  IQuote,
  IEmbed,
  MessageInteraction,
  IQuoteAuthor
} from "shared/models";

import { formatEmbed } from 'shared/utils';


/**
 * Quote Handler
 */

export const quoteHandler = (
  interaction: MessageInteraction,
  client: IClient
) => {


  /**
   * Format Quote
   */

  const formatQuote = memoize(async (
    quote: IQuote
  ) => {
    const quoteData = await setQuoteData(quote);

    return formatEmbed(quoteData, client);
  })


  /**
   * Set Quote Data
   */

  const setQuoteData = memoize(async (
    quote: IQuote
  ): Promise<IEmbed> => {
    const author = await _fetchMember(quote.authorID);

    const quoteText = quote.deleted
      ? `#${quote.indexNum}: [REDACTED]`
      : `#${quote.indexNum}: ${quote.quote}`;

    return {
      text: quoteText,
      author: author.authorName,
      authorAvatar: author.authorAvatar,
      date: new Date(quote.createdAt)
    }
  })


  /**
   * Fetch Server Member
   */

  const _fetchMember = memoize(async (
    authorID: string
  ) => {
    let authorName: string;
    let authorAvatar: string;

    try {
      const author = await interaction.guild.members.fetch(authorID);
      
      authorName = author.displayName;
      authorAvatar = author.displayAvatarURL();
    } catch {
      authorName = '[REDACTED]';
      authorAvatar = client.user.displayAvatarURL();
    };

    return { authorName, authorAvatar } as IQuoteAuthor;
  })


  /**
   * Return Quote Handler
   */

  return { formatQuote, setQuoteData };
}