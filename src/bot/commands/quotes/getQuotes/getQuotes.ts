import { getQuotesLegacyCommands, getQuotesSlashCommands } from './handlers';


/**
 * Get Quotes Commands
 */

export const getQuotesCommands = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;

  const { legacyCommands } = getQuotesLegacyCommands(_quoteAPIUrl);
  const { slashCommands } = getQuotesSlashCommands(_quoteAPIUrl);
  

  /**
   * Return Commands
   */

  return { legacyCommands, slashCommands };
}