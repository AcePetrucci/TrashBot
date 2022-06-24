import { EmbedFieldData } from 'discord.js';

import { IClient, MessageInteraction } from "shared/models";

import { helpHandler } from 'bot/handlers';


/**
 * Delete Quote Help Event
 */

export const deleteQuoteHelpEvent = () => {

  const embedField: EmbedFieldData = {
    name: 'Delete Quotes Commands',
    value: `
      **!dquote <quote_index>**
      Ex: *!dquote 1*
      Deletes the quote's content if it's not the last quote created on the server.
      If it is, the quote is permanently and completely deleted.
    `,
  };


  const deleteQuoteHelp = (interaction: MessageInteraction, client: IClient) => {

    const { helpReply } = helpHandler(interaction, client);

    
    /**
     * Return Embed Help Message
     */

    return helpReply(embedField, 'Delete Quote');
  }


  /**
   * Return Embed Help Event
   */

  return { deleteQuoteHelp };
}