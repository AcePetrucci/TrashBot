import { Message, MessageEmbed } from "discord.js";
import { of } from 'rxjs';

import {
  IClient,
  MessageInteraction,
  InteractionDeferred
} from "shared/models";

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


/**
 * 
 */

export const interactionHandler = (
  interaction: MessageInteraction,
  client?: IClient,
  previousDeferredMessage?: Promise<InteractionDeferred>
) => {

  let quoteDeferredMessage: Promise<InteractionDeferred> = previousDeferredMessage;


  /**
   * Defer
   */

  const interactionDefer = (content: string) => {
    quoteDeferredMessage = interaction.options
      ? interaction.deferReply()
      : interaction.channel.send(content);

    return of(quoteDeferredMessage);
  }

  const interactionDeferEmbed = (content: string) => {
    const embedTempData = setEmbedData(content, client);
    const embedTempMessage = formatEmbed(embedTempData, client);
  
    quoteDeferredMessage = interaction.options
      ? interaction.deferReply()
      : interaction.channel.send({embeds: [embedTempMessage]});

    return of(quoteDeferredMessage);
  }


  /**
   * Edit
   */

  const interactionEditReply = async (content: string) => {
    return interaction.options
      ? interaction.editReply(content)
      : (await quoteDeferredMessage as Message).edit(content);
  }

  const interactionEditReplyEmbed = async (content: MessageEmbed) => {
    return interaction.options
      ? interaction.editReply({embeds: [content]})
      : (await quoteDeferredMessage as Message).edit({embeds: [content]});
  }


  /**
   * Send
   */

  const interactionReply = (content: string) => {
    return interaction.options
      ? interaction.reply(content)
      : interaction.channel.send(content);
  }

  const interactionReplyEmbed = (content: MessageEmbed) => {
    return interaction.options
      ? interaction.reply({embeds: [content]})
      : interaction.channel.send({embeds: [content]});
  }


  /**
   * Errors
   */

  const interactionErrorReply = (content: string) => {
    const embedData = setEmbedData(content, client);
    const embedMsg = formatEmbed(embedData, client);
    
    return interactionReplyEmbed(embedMsg);
  }

  const interactionErrorEditReply = (content: string) => {
    const embedData = setEmbedData(content, client);
    const embedMsg = formatEmbed(embedData, client);
    
    return interactionEditReplyEmbed(embedMsg);
  }


  /**
   * Return Interactions
   */

  return {
    interactionDefer,
    interactionDeferEmbed,
    interactionEditReply,
    interactionEditReplyEmbed,
    interactionReply,
    interactionReplyEmbed,
    interactionErrorReply,
    interactionErrorEditReply,
    quoteDeferredMessage
  };
}