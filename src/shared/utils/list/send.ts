import { Client, Message } from 'discord.js';

import {
  IEmbed,
  MessageInteraction,
  IListType
} from 'shared/models';

import { formatEmbed, setEmbedData } from '../embed';
import { interactionEditReplyEmbed } from '../interactionReply'; 


/**
 * Edit
 */

export const editListMessage = async (
  content: string,
  type: IListType,
  interaction: MessageInteraction,
  client: Client,
  previousMessage?: void | Message<boolean>,
) => {
  const embedData: IEmbed = {
    ...setEmbedData(`${type} List: ${content}`, client),
    ...{
      author: interaction.guild.name,
      authorAvatar: interaction.guild.iconURL(),
    }
  };
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionEditReplyEmbed(embedMsg, interaction, previousMessage);
}
