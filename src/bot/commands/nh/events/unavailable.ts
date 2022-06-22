import { of } from "rxjs";

import { IClient, MessageInteraction } from "shared/models";

import { interactionHandler } from 'shared/utils';


/**
 * NH Unavailable Event
 */

export const nhUnavailableEvent = () => {

  /**
   * NH Unavailable Command
   */

   const nhUnavailable = (interaction: MessageInteraction, client: IClient) => {
    const {
      interactionErrorReply
    } = interactionHandler(interaction, client);

    return of(interactionErrorReply('Unavailable Command'));
  }


  /**
   * Return NH Unavailable Event
   */

  return { nhUnavailable }
}