import { IClient, MessageInteraction } from "shared/models";


/**
 * Set Status Event
 */

export const setStatusEvent = () => {

  const setStatus = (
    interaction: MessageInteraction,
    client: IClient,
  ) => {
    const status = interaction.content.split(' ').slice(1).join(' ');

    client.user.setActivity(status || '!trash or !trash -h');

    return Promise.resolve();
  }


  /**
   * Return Set Status
   */

  return { setStatus };
}