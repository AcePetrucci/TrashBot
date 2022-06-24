import { MessageInteraction, IClient } from "shared/models";

import {
  getCustomCommandEvent,
  getCustomCommandsListEvent,
  getCustomCommandsHelpEvent,
  addCustomCommandEvent,
  deleteCustomCommandEvent
} from '../events';


/**
 * Get Custom Legacy Commands
 */

export const customLegacyCommands = (quoteAPIUrl: string) => {

  let _guildID: string;

  const { getCustomCommand } = getCustomCommandEvent();
  const { getCustomCommandsList } = getCustomCommandsListEvent();
  const { getCustomCommandsHelp } = getCustomCommandsHelpEvent();

  const { addCustomCommand } = addCustomCommandEvent();

  const { deleteCustomCommand } = deleteCustomCommandEvent();


  /**
   * Legacy Commands
   */

  const legacyCommands = (message: MessageInteraction, client: IClient) => {
    _guildID = message.guildId;

    switch (true) {
      case message.content === '!commandlist':
        return getCustomCommandsList(message, client, _guildID);

      case message.content.startsWith('!addcommand'):
        return addCustomCommand(message, client, _guildID);

      case message.content.startsWith('!dcommand'):
        return deleteCustomCommand(message, client, _guildID);

      case message.content.startsWith('!custom -h'):
        return getCustomCommandsHelp(message, client);

      default:
        return getCustomCommand(message, client, _guildID);
    }
  }


  /**
   * Return Legacy Commands
   */

  return { legacyCommands };
}