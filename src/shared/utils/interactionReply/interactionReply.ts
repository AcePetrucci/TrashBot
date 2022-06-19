import { MessageEmbed } from "discord.js";

import { MessageInteraction } from "shared/models/interaction";

export const interactionReply = (content: string, interaction: MessageInteraction) => {
  return interaction.options
    ? interaction.reply(content)
    : interaction.channel.send(content)
}

export const interactionReplyEmbed = (content: MessageEmbed, interaction: MessageInteraction) => {
  return interaction.options
    ? interaction.reply({embeds: [content]})
    : interaction.channel.send({embeds: [content]})
}