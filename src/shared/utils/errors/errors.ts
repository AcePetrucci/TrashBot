import { Client } from 'discord.js';

import { MessageInteraction } from 'shared/models';

import { formatEmbed, setEmbedData } from '../embed';
import { interactionReplyEmbed } from '../interactionReply'; 


export const sendErrorEmbed = async (error: string, interaction: MessageInteraction, client: Client) => {
  const embedData = setEmbedData(error, client);
  const embedMsg = formatEmbed(embedData, client);
  
  return interactionReplyEmbed(embedMsg, interaction);
}