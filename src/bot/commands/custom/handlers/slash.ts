import { MessageInteraction, IClient } from "shared/models";

import {
  getCustomCommandEvent,
  getCustomCommandsListEvent,
  addCustomCommandEvent,
  deleteCustomCommandEvent
} from '../events';


/**
 * Get Custom Slash Commands
 */

export const customSlashCommands = (quoteAPIUrl: string) => {

  let _guildID: string;

  const { getCustomCommand } = getCustomCommandEvent();
  const { getCustomCommandsList } = getCustomCommandsListEvent();

  const { addCustomCommand } = addCustomCommandEvent();

  const { deleteCustomCommand } = deleteCustomCommandEvent();


  /**
   * Slash Commands
   */

   const slashCommands = (interaction: MessageInteraction, client: IClient) => {
    _guildID = interaction.guildId;

    const subInteraction = interaction.options.data[0];

    switch (true) {
      case subInteraction.name === 'get':
        return getCustomCommand(interaction, client, _guildID, subInteraction.options);

      case subInteraction.name === 'add':
        return addCustomCommand(interaction, client, _guildID, subInteraction.options);

      case subInteraction.name === 'delete':
        return deleteCustomCommand(interaction, client, _guildID, subInteraction.options);

      case subInteraction.name === 'list':
        return getCustomCommandsList(interaction, client, _guildID);

      default:
        return Promise.resolve();
    }
  }


  /**
   * Return Slash Commands
   */

  return { slashCommands };
}