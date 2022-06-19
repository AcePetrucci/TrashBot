import { Client } from 'discord.js';

import { MessageInteraction } from 'shared/models';

import { formatEmbed, setEmbedData } from '../embed';
import { interactionReplyEmbed } from '../interactionReply'; 


export const sendErrorEmbed = async (interaction: MessageInteraction, client: Client, error: string) => {
  const embedData = setEmbedData(client, error);
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionReplyEmbed(interaction, embedMsg);
}