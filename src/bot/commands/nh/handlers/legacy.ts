import { MessageInteraction, IClient } from "shared/models";

import {
  nhHelpEvent,
  nhSearchEvents,
  nhToggleEvent
} from '../events';


/**
 * NH Legacy Commands
 */

export const nhLegacyCommands = (quoteAPIUrl: string) => {

  let _guildID: string;

  const { nhHelp } = nhHelpEvent();
  const { nhToggle } = nhToggleEvent(quoteAPIUrl);
  const {
    nhDoujinByTag,
    nhRandomDoujin,
    nhRandomTag
  } = nhSearchEvents();


  /**
   * Legacy Commands
   */

  const legacyCommands = (message: MessageInteraction, client: IClient) => {
    _guildID = message.guildId;

    switch (true) {
      case message.content === '!nh':
        return nhRandomDoujin(message);

      case message.content.startsWith('!nh tag'):
        return nhRandomTag(message);

      case message.content.startsWith('!nh -h'):
        return nhHelp(message, client);

      case message.content.startsWith('!nh disable'):
        return nhToggle(message, client, _guildID, true);

      case message.content.startsWith('!nh enable'):
        return nhToggle(message, client, _guildID, false);

      default:
        return nhDoujinByTag(message);
    }
  }


  /**
   * Return Legacy Commands
   */

  return { legacyCommands };
}