import { MessageEmbed } from "discord.js";

import { MessageInteraction } from "shared/models/interaction";

export const interactionReply = (interaction: MessageInteraction, content: string) => {
  return interaction.options
    ? interaction.reply(content)
    : interaction.channel.send(content)
}

export const interactionReplyEmbed = (interaction: MessageInteraction, content: MessageEmbed) => {
  return interaction.options
    ? interaction.reply({embeds: [content]})
    : interaction.channel.send({embeds: [content]})
}