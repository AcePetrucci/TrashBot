import { EmbedFieldData } from 'discord.js';

import { IClient, MessageInteraction } from "shared/models";

import { helpHandler } from 'bot/handlers';


/**
 * Add Quote Help Event
 */

export const addQuoteHelpEvent = () => {

  const embedField: EmbedFieldData = {
    name: 'Add Quotes Commands',
    value: `
      **!addquote <quote_text> - <@user>**
      Ex: *!addquote This bot is truly trash - @user*
      Adds a quote with the given text and user. The user MUST be after a "-", else it will not format the quote properly.
    `,
  };


  const addQuoteHelp = (interaction: MessageInteraction, client: IClient) => {

    const { helpReply } = helpHandler(interaction, client);

    
    /**
     * Return Embed Help Message
     */

    return helpReply(embedField, 'Add Quote');
  }


  /**
   * Return Embed Help Event
   */

  return { addQuoteHelp };
}