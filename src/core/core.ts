import { Client } from 'discord.js';

import { intentsList } from 'shared/utils'

import {
  readyEvent,
  messageCreateEvent,
  interactionCreateEvent
} from 'bot/events';

import { IClient } from 'shared/models';


/**
 * TrashBot
 */

export const TrashBot = () => {
  let client: IClient = new Client({intents: intentsList});

  const { clientReady } = readyEvent(client);
  const { clientMessageCreate } = messageCreateEvent(client);
  const { clientInteractionCreate } = interactionCreateEvent(client);


  /**
   * Init Lifecycle
   */

  const trashBotInit = () => {

    /**
     * Ready
     */

    clientReady();


    /**
     * Message
     */

    clientMessageCreate();


    /**
     * Interaction
     */

    clientInteractionCreate();


    /**
     * Login
     */

    return client.login(process.env.TOKEN);
  }


  /**
   * Return methods
   */

  return { trashBotInit };
}