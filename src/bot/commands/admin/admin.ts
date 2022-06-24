import { adminLegacyCommands } from './handlers';


/**
 * Quotes Commands
 */

export const adminCommands = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;

  const { legacyCommands } = adminLegacyCommands(_quoteAPIUrl);
  

  /**
   * Return Commands
   */

  return { legacyCommands };
}