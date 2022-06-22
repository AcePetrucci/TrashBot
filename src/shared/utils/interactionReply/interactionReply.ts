import { Message, MessageEmbed } from "discord.js";

import { IClient, MessageInteraction } from "shared/models";

import {
  setEmbedData,
  formatEmbed
} from '../embed';


/**
 * Send
 */

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


/**
 * Edit
 */

export const interactionEditReply = (
  content: string,
  interaction: MessageInteraction,
  previousMessage?: Message,
) => {
  return interaction.options
    ? interaction.editReply(content)
    : previousMessage.edit(content)
}

export const interactionEditReplyEmbed = async (
  content: MessageEmbed,
  interaction: MessageInteraction,
  previousMessage?: void | Message<boolean>,
) => {
  return interaction.options
    ? interaction.editReply({embeds: [content]})
    : (previousMessage as Message).edit({embeds: [content]})
}


/**
 * Defer
 */

export const interactionDefer = (
  content: string,
  interaction: MessageInteraction,
) => {
  return interaction.options
    ? interaction.deferReply()
    : interaction.channel.send(content)
}

export const interactionDeferEmbed = (
  content: string,
  interaction: MessageInteraction,
  client: IClient,
) => {
  const embedTempData = setEmbedData(content, client);
  const embedTempMessage = formatEmbed(embedTempData, client);

  return interaction.options
    ? interaction.deferReply()
    : interaction.channel.send({embeds: [embedTempMessage]})
}