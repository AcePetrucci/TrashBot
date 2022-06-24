import { Client } from 'discord.js';

import {
  readyEvent,
  messageCreateEvent,
  interactionCreateEvent,
  guildCreateEvent
} from 'bot/events';

import { IClient } from 'shared/models';

import { intentsList } from 'shared/utils'


/**
 * TrashBot
 */

export const TrashBot = () => {

  let client: IClient = new Client({intents: intentsList});

  const { clientReady } = readyEvent(client);
  const { clientMessageCreate } = messageCreateEvent(client);
  const { clientInteractionCreate } = interactionCreateEvent(client);
  const { serverJoin } = guildCreateEvent(client);


  /**
   * Init Lifecycle
   */

  const trashBotInit = () => {

    /**
     * Ready
     */

    clientReady();


    /**
     * Server Join
     */

    serverJoin();


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