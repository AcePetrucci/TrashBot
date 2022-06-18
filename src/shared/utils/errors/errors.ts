import { Message, Client, MessageEmbed } from "discord.js"


/**
 * Send Error in Embed Format
 */

export const sendError = (errorText: string, message: Message, client: Client) => {
  const embed = new MessageEmbed()
    .setColor(0xec407a)
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.avatarURL()
    })
    .setTitle(errorText)
    .setTimestamp(new Date());

  return message.channel.send({
    embeds: [embed]
  })
}