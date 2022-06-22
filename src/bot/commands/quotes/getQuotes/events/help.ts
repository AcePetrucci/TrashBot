import { EmbedFieldData } from 'discord.js';

import { IClient, MessageInteraction } from "shared/models";

import {
  setEmbedHelpData,
  formatEmbedHelp,
  interactionReplyEmbed
} from 'shared/utils';


/**
 * Get Quotes Help Event
 */

export const getQuotesHelpEvent = () => {

  const embedField: EmbedFieldData = {
    name: 'Get Quotes Commands',
    value: `
      **!quote**
      Shows a random quote from this server.

      **!quote -h**
      Shows the quote help panel (this one right here).

      **!quotelist**
      Shows this server's list of quotes as a .txt file.

      **!quoteratio <@user>**
      Ex: *!quote @User*
      Shows the quote ratio of the specified user in comparsion to the server members.
      
      **!quote <quote_index>**
      Ex: *!quote 1*
      Shows a specific quote based on its index.

      **!quote <quote_text>**
      Ex: *!quote monkey*
      Shows a random quote which contains the specified quote text.
    `,
  };


  const getQuotesHelp = (interaction: MessageInteraction, client: IClient) => {

    /**
     * Set Embed Help Data
     */

    const embedHelpData = setEmbedHelpData('Quote', embedField, client);


    /**
     * Format Embed Help Message
     */

    const embedHelpMessage = formatEmbedHelp(embedHelpData, client);


    /**
     * Return Embed Help Message
     */

    return interactionReplyEmbed(embedHelpMessage, interaction);;
  }


  /**
   * Return Embed Help Event
   */

  return { getQuotesHelp };
}