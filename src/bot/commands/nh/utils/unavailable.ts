import { switchMap, map, defer, of } from "rxjs";

import { IClient, MessageInteraction } from "shared/models";

import {
  setEmbedData,
  formatEmbed,
  interactionReplyEmbed
} from 'shared/utils';


/**
 * NH Unavailable Event
 */

export const nhUnavailableEvent = () => {

  /**
   * NH Unavailable Command
   */

   const nhUnavailable = (interaction: MessageInteraction, client: IClient) => {
    return defer(() => of(setEmbedData('Unavailable Command', client))).pipe(
      map(embedData => formatEmbed(embedData, client)),
      switchMap(embedMsg => interactionReplyEmbed(embedMsg, interaction))
    )
  }


  /**
   * Return NH Unavailable Event
   */

  return { nhUnavailable }
}