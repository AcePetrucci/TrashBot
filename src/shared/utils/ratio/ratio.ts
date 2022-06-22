import {
  Client,
  MessageEmbed,
  EmbedFieldData,
  GuildMember
} from 'discord.js';

import { IEmbedHelp } from 'shared/models';


/**
 * Set Up Embed Ratio Data
 */

export const setEmbedRatioData = (
  fields: EmbedFieldData[],
  author: GuildMember
): IEmbedHelp => {
  return {
    author: author.displayName,
    authorAvatar: author.displayAvatarURL(),
    fields
  };
}


/**
 * Format Embed Ratio Data to Send
 */

export const formatEmbedRatioData = (
  embedHelpData: IEmbedHelp,
  client: Client
) => {
  return new MessageEmbed()
    .setColor(0xec407a)
    .setAuthor({
      name: embedHelpData.author,
      iconURL: embedHelpData.authorAvatar ?? client.user.displayAvatarURL()
    })
    .setTitle('')
    .setFields(embedHelpData.fields)
}