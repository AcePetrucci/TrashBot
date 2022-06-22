import { quotesLegacyCommands, quotesSlashCommands } from './handlers';


/**
 * Quotes Commands
 */

export const quotesCommands = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;

  const { legacyCommands } = quotesLegacyCommands(_quoteAPIUrl);
  const { slashCommands } = quotesSlashCommands(_quoteAPIUrl);
  

  /**
   * Return Commands
   */

  return { legacyCommands, slashCommands };
}