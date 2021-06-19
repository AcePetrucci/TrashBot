import { Message, Client } from "discord.js"


/**
 * Send Error in Embed Format
 */

export const sendError = (errorText: string, message: Message, client: Client) => {
  return message.channel.send({
    embed: {
      color: 0xec407a,
      author: {
        name: client.user.username,
        iconURL: client.user.avatarURL()
      },
      title: errorText,
      timestamp: new Date()
    }
  })
}