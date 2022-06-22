import { Client, Message } from 'discord.js';

import {
  IEmbed,
  MessageInteraction,
  IListType,
  InteractionDeferred
} from 'shared/models';

import { formatEmbed, setEmbedData } from '../embed';
import { interactionHandler } from '../interactionReply'; 


/**
 * Edit
 */

export const editListMessage = async (
  content: string,
  type: IListType,
  interaction: MessageInteraction,
  client: Client,
  previousMessage?: Promise<InteractionDeferred>,
) => {
  const {
    interactionEditReplyEmbed
  } = interactionHandler(interaction, client, previousMessage);

  const embedData: IEmbed = {
    ...setEmbedData(`${type} List: ${content}`, client),
    ...{
      author: interaction.guild.name,
      authorAvatar: interaction.guild.iconURL(),
    }
  };
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionEditReplyEmbed(embedMsg);
}
