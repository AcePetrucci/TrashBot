import { customLegacyCommands, customSlashCommands } from './handlers';


/**
 * Quotes Commands
 */

export const customCommands = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;

  const { legacyCommands } = customLegacyCommands(_quoteAPIUrl);
  const { slashCommands } = customSlashCommands(_quoteAPIUrl);
  

  /**
   * Return Commands
   */

  return { legacyCommands, slashCommands };
}