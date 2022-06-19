import { MessageInteraction, IClient } from "shared/models";

import {
  nhSearchEvents,
  nhToggleEvent,
  nhUnavailableEvent
} from '../events';


/**
 * NH Slash Commands
 */

export const nhSlashCommands = (quoteAPIUrl: string) => {

  let _guildID: string;

  const { nhToggle } = nhToggleEvent(quoteAPIUrl);
  const {
    nhDoujinByTag,
    nhRandomDoujin,
    nhRandomTag
  } = nhSearchEvents();
  const { nhUnavailable } = nhUnavailableEvent();


  /**
   * Slash Commands
   */

   const slashCommands = (interaction: MessageInteraction, client: IClient) => {
    _guildID = interaction.guildId;

    const subInteraction = interaction.options.data[0];

    switch (true) {
      case subInteraction.name === 'random':
        return nhRandomDoujin(interaction);

      case subInteraction.name === 'random-tag':
        return nhRandomTag(interaction);

      case subInteraction.name === 'search-by-tag':
        return nhDoujinByTag(interaction, subInteraction.options);

      case subInteraction.name === 'disable':
        return nhToggle(interaction, client, _guildID, true);

      case subInteraction.name === 'enable':
        return nhToggle(interaction, client, _guildID, false);

      default:
        return nhUnavailable(interaction, client);
    }
  }


  /**
   * Return Slash Commands
   */

  return { slashCommands };
}