import { EmbedFieldData } from 'discord.js';

import { IClient, MessageInteraction } from "shared/models";

import {
  setEmbedHelpData,
  formatEmbedHelp,
  interactionReplyEmbed
} from 'shared/utils';


/**
 * NH Help Event
 */

export const nhHelpEvent = () => {

  const embedField: EmbedFieldData = {
    name: 'NH Commands',
    value: `
      **!nh**
      Search for a random NH doujin.

      **!nh tag**
      Search for a random NH tag and return its page.
      
      **!nh <tag_names>**
      Ex: *!nh yuri english*
      Search for a specific tag and return a random doujin which contains the specified tag(s).

      **!nh disable**
      Disables the !nh auto timer, preventing the bot of sending random nh at any given amount of time.

      **!nh enable**
      Enables the !nh auto timer, allowing the bot of sending random nh at any given amount of time.
    `,
  };


  const nhHelp = (interaction: MessageInteraction, client: IClient) => {

    /**
     * Set Embed Help Data
     */

    const embedHelpData = setEmbedHelpData('NH', embedField, client);


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

  return { nhHelp };
}