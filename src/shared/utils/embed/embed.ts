import { Client, MessageEmbed } from 'discord.js';

import { IEmbed } from 'shared/models';


/**
 * Set Up Embed Data
 */

export const setEmbedData = (client: Client, content: string): IEmbed => {
  return {
    author: client.user.username,
    authorAvatar: client.user.avatarURL(),
    text: content,
    date: new Date()
  };
}


/**
 * Format Embed Data to Send
 */

export const formatEmbed = (embedData: IEmbed, client: Client) => {
  return new MessageEmbed()
    .setColor(0xec407a)
    .setAuthor({
      name: embedData.author,
      iconURL: embedData.authorAvatar ?? client.user.avatarURL()
    })
    .setTitle(embedData.text.length > 256 ? '' : embedData.text)
    .setDescription(embedData.text.length < 256 ? '' : embedData.text)
    .setTimestamp(embedData.date);
}