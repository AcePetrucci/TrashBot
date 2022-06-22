import { MessageInteraction, IClient } from "shared/models";

import {
  getQuotesRandomEvent,
  getQuotesByIndexEvent,
  getQuotesByTextEvent,
  getQuotesListEvent,
  getQuotesRatioEvent,
  getQuotesHelpEvent,
  addQuoteEvent
} from '../events';


/**
 * Get Quotes Legacy Commands
 */

export const quotesLegacyCommands = (quoteAPIUrl: string) => {

  let _guildID: string;

  const { getRandomQuote } = getQuotesRandomEvent();
  const { getQuoteByIndex } = getQuotesByIndexEvent();
  const { getQuoteByText } = getQuotesByTextEvent();
  const { getQuoteList } = getQuotesListEvent();
  const { getQuoteRatio } = getQuotesRatioEvent();
  const { getQuotesHelp } = getQuotesHelpEvent();

  const { addQuote } = addQuoteEvent();


  /**
   * Legacy Commands
   */

  const legacyCommands = (message: MessageInteraction, client: IClient) => {
    _guildID = message.guildId;

    const quoteIndex = +message.content.split(' ').slice(1).join(' ');

    switch (true) {
      case message.content === '!quote':
        return getRandomQuote(message, client, _guildID);

      case message.content.startsWith('!quote -h'):
        return getQuotesHelp(message, client);

      case message.content.startsWith('!quotelist'):
        return getQuoteList(message, client, _guildID);

      case message.content.startsWith('!quoteratio'):
        return getQuoteRatio(message, client, _guildID);

      case message.content.startsWith('!addquote'):
        return addQuote(message, client, _guildID);

      case isNaN(quoteIndex):
        return getQuoteByText(message, client, _guildID);

      default:
        return getQuoteByIndex(message, client, _guildID);
    }
  }


  /**
   * Return Legacy Commands
   */

  return { legacyCommands };
}