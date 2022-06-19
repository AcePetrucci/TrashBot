import { catchError, from, switchMap, map, defer } from "rxjs";

import axios from 'axios';

import { IClient, MessageInteraction } from "shared/models";

import {
  interactionReplyEmbed,
  formatEmbed,
  setEmbedData,
  sendErrorEmbed
} from 'shared/utils';


/**
 * NH Toggle Event
 */

export const nhToggleEvent = (quoteAPIUrl: string) => {

  /**
   * NH Toggle
   */

  const nhToggle = (
    interaction: MessageInteraction,
    client: IClient,
    guildID: string,
    disabled: boolean
  ) => {
    return defer(() => from(axios.post(quoteAPIUrl, {
      query: `mutation {
        toggleNh(guildID: "${guildID}", disabled: ${disabled}) {
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      map(() => setEmbedData(`This server has ${disabled ? 'disabled' : 'enabled'} the !nh timer`, client)),
      map(embedData => formatEmbed(embedData, client)),
      switchMap(embedMsg => interactionReplyEmbed(embedMsg, interaction)),
      catchError(err => sendErrorEmbed('Could not update the server config.', interaction, client))
    ));
  }


  /**
   * Return NH Toggle Event
   */

  return { nhToggle };
}