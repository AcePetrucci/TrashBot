import { catchError, from, switchMap, map } from "rxjs";

import axios from 'axios';

import { IClient, MessageInteraction } from "shared/models";

import {
  formatEmbed,
  setEmbedData,
  interactionHandler
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
    const {
      interactionDeferEmbed,
      interactionEditReplyEmbed,
      interactionErrorEditReply
    } = interactionHandler(interaction, client);

    return interactionDeferEmbed('Toggling server\'s NH settings...').pipe(
      switchMap(() => _setNhToggle(guildID, disabled)),
      map(() => setEmbedData(`This server has ${disabled ? 'disabled' : 'enabled'} the !nh timer`, client)),
      map(embedData => formatEmbed(embedData, client)),
      switchMap(embedMsg => interactionEditReplyEmbed(embedMsg)),
      catchError(err => interactionErrorEditReply('Could not update the server settings'))
    )
  }


  /**
   * NH Toggle API Call
   */

  const _setNhToggle = (
    guildID: string,
    disabled: boolean,
  ) => {
    return from(axios.post(quoteAPIUrl, {
      query: `mutation {
        toggleNh(guildID: "${guildID}", disabled: ${disabled}) {
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    }));
  }


  /**
   * Return NH Toggle Event
   */

  return { nhToggle };
}