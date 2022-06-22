import { MessageInteraction, IClient } from "shared/models";

import {
  getQuotesRandomEvent,
  getQuotesByIndexEvent,
  getQuotesByTextEvent,
  getQuotesListEvent,
  getQuotesRatioEvent,
  addQuoteEvent
} from '../events';


/**
 * Get Quotes Slash Commands
 */

export const quotesSlashCommands = (quoteAPIUrl: string) => {

  let _guildID: string;

  const { getRandomQuote } = getQuotesRandomEvent();
  const { getQuoteByIndex } = getQuotesByIndexEvent();
  const { getQuoteByText } = getQuotesByTextEvent();
  const { getQuoteList } = getQuotesListEvent();
  const { getQuoteRatio } = getQuotesRatioEvent();

  const { addQuote } = addQuoteEvent();


  /**
   * Slash Commands
   */

   const slashCommands = (interaction: MessageInteraction, client: IClient) => {
    _guildID = interaction.guildId;

    const subInteraction = interaction.options.data[0];

    switch (true) {
      case subInteraction.name === 'random':
        return getRandomQuote(interaction, client, _guildID);

      case subInteraction.name === 'search-by-index':
        return getQuoteByIndex(interaction, client, _guildID, subInteraction.options);

      case subInteraction.name === 'search-by-text':
        return getQuoteByText(interaction, client, _guildID, subInteraction.options);

      case subInteraction.name === 'list':
        return getQuoteList(interaction, client, _guildID);

      case subInteraction.name === 'ratio':
        return getQuoteRatio(interaction, client, _guildID, subInteraction.options);

      case subInteraction.name === 'add':
        return addQuote(interaction, client, _guildID, subInteraction.options);

      default:
        return Promise.resolve();
    }
  }


  /**
   * Return Slash Commands
   */

  return { slashCommands };
}