import { nhLegacyCommands, nhSlashCommands } from './handlers';


/**
 * NH Commands
 */

export const nhCommands = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;

  const { legacyCommands } = nhLegacyCommands(_quoteAPIUrl);
  const { slashCommands } = nhSlashCommands(_quoteAPIUrl);
  

  /**
   * Return Commands
   */

  return { legacyCommands, slashCommands };
}