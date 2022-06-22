import { memoize } from 'lodash/fp';

import {
  IQuote,
  MessageInteraction,
  IEmbed,
  IClient,
  IQuoteAuthor
} from "shared/models";


/**
 * Format Quote
 */

export const formatQuote = memoize(async (
  quote: IQuote,
  interaction: MessageInteraction,
  client: IClient
): Promise<IEmbed> => {
  const author = await _fetchMember(quote.authorID, interaction, client);

  const quoteText = quote.deleted
    ? '[REDACTED]'
    : `#${quote.indexNum}: ${quote.quote}`;

  return {
    text: quoteText,
    author: author.authorName,
    authorAvatar: author.authorAvatar,
    date: new Date(quote.createdAt)
  }
})


/**
 * Fetch Guild Member
 */

const _fetchMember = memoize(async (
  authorID: string,
  interaction: MessageInteraction,
  client: IClient
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