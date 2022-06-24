import { of } from "rxjs";

import { IClient, MessageInteraction } from "shared/models";

import {
  interactionHandler
} from 'bot/handlers';


/**
 * NH Unavailable Event
 */

export const nhUnavailableEvent = () => {

  /**
   * NH Unavailable Command
   */

   const nhUnavailable = (interaction: MessageInteraction, client: IClient) => {
    const { errorReply } = interactionHandler(interaction, client);

    return of(errorReply('Unavailable Command'));
  }


  /**
   * Return NH Unavailable Event
   */

  return { nhUnavailable }
}