import { EmbedFieldData } from 'discord.js';

import { IClient, MessageInteraction } from "shared/models";

import { helpHandler } from 'bot/handlers';


/**
 * Get Custom Commands Help Event
 */

export const getCustomCommandsHelpEvent = () => {

  const embedField: EmbedFieldData = {
    name: 'Custom Commands',
    value: `
      **!commandlist**
      Shows this server's list of commands as a .txt file.

      **!command -h**
      Shows the quote help panel (this one right here).

      **!addcommand <command_name> - <command_text>**
      Adds a custom command with the given command name and command text.
      
      **!dcommand <command_name>**
      Deletes a custom command with the given command name.
    `,
  };


  const getCustomCommandsHelp = (interaction: MessageInteraction, client: IClient) => {

    const { helpReply } = helpHandler(interaction, client);

    
    /**
     * Return Embed Help Message
     */

    return helpReply(embedField, 'Custom');
  }


  /**
   * Return Embed Help Event
   */

  return { getCustomCommandsHelp };
}