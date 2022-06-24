import { MessageInteraction, IClient } from "shared/models";

import { setStatusEvent } from '../events';


/**
 * Admin Legacy Commands
 */

export const adminLegacyCommands = (quoteAPIUrl: string) => {

  let _guildID: string;

  const { setStatus } = setStatusEvent();


  /**
   * Legacy Commands
   */

  const legacyCommands = (message: MessageInteraction, client: IClient) => {
    _guildID = message.guildId;

    switch (true) {
      case message.content.startsWith('!setStatus'):
        return setStatus(message, client);

      default:
        return Promise.resolve();
    }
  }


  /**
   * Return Legacy Commands
   */

  return { legacyCommands };
}