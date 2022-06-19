import { Client, MessageEmbed, EmbedFieldData } from 'discord.js';

import { IEmbed, IEmbedHelp } from 'shared/models';


/**
 * Set Up Embed Data
 */

export const setEmbedData = (
  content: string,
  client: Client,
): IEmbed => {
  return {
    author: client.user.username,
    authorAvatar: client.user.avatarURL(),
    text: content,
    date: new Date()
  };
}

export const setEmbedHelpData = (
  title: string,
  field: EmbedFieldData,
  client: Client,
): IEmbedHelp => {
  return {
    author: client.user.username,
    authorAvatar: client.user.avatarURL(),
    title: `TrashBot ${title} Legacy Help`,
    fields: [{
      name: `This is the Legacy version of ${title} Commands`,
      value: `It is highly recommended that you use the ${title} Slash Commands version instead`
    }, field]
  };
}


/**
 * Format Embed Data to Send
 */

export const formatEmbed = (
  embedData: IEmbed,
  client: Client
) => {
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


/**
 * Format Embed Data to Send a Help Instruction
 */

export const formatEmbedHelp = (
  embedHelpData: IEmbedHelp,
  client: Client
) => {
  return new MessageEmbed()
    .setColor(0xec407a)
    .setAuthor({
      name: embedHelpData.author,
      iconURL: embedHelpData.authorAvatar ?? client.user.avatarURL()
    })
    .setTitle(embedHelpData.title)
    .setFields(embedHelpData.fields)
}