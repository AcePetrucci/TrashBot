import { Client, Message } from 'discord.js';

import { MessageInteraction, InteractionDeferred } from 'shared/models';

import { formatEmbed, setEmbedData } from '../embed';
import { interactionHandler } from '../interactionReply'; 


/**
 * Send
 */

export const sendErrorEmbed = async (
  content: string,
  interaction: MessageInteraction,
  client: Client
) => {
  const { interactionReplyEmbed } = interactionHandler(interaction, client);

  const embedData = setEmbedData(content, client);
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionReplyEmbed(embedMsg);
}


/**
 * Edit
 */

export const editErrorEmbed = async (
  content: string,
  interaction: MessageInteraction,
  client: Client,
  previousMessage?: Promise<InteractionDeferred>,
) => {
  const { interactionEditReplyEmbed } = interactionHandler(interaction, client, previousMessage);

  const embedData = setEmbedData(content, client);
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionEditReplyEmbed(embedMsg);
}