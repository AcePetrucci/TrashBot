import { Client, Message } from 'discord.js';

import { MessageInteraction } from 'shared/models';

import { formatEmbed, setEmbedData } from '../embed';
import { interactionReplyEmbed, interactionEditReplyEmbed } from '../interactionReply'; 


/**
 * Send
 */

export const sendErrorEmbed = async (
  content: string,
  interaction: MessageInteraction,
  client: Client
) => {
  const embedData = setEmbedData(content, client);
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionReplyEmbed(embedMsg, interaction);
}


/**
 * Edit
 */

export const editErrorEmbed = async (
  content: string,
  interaction: MessageInteraction,
  client: Client,
  previousMessage?: void | Message<boolean>,
) => {
  const embedData = setEmbedData(content, client);
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionEditReplyEmbed(embedMsg, interaction, previousMessage);
}