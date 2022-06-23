import { Message, MessageEmbed } from "discord.js";
import { of, switchMap } from 'rxjs';

import {
  IClient,
  MessageInteraction,
  InteractionDeferred,
} from "shared/models";

import {
  setEmbedData,
  formatEmbed
} from 'shared/utils/embed';


/**
 * Interaction Handler
 */

export const interactionHandler = (
  interaction: MessageInteraction,
  client?: IClient,
  previousInteractionInstance?: InteractionDeferred
) => {

  const interactionInstance = previousInteractionInstance ?? {};


  /**
   * Defer
   */

  const defer = (content: string) => {
    interactionInstance.deferredMessage = interaction.options
      ? interaction.deferReply()
      : interaction.channel.send(content);

    return of(interactionInstance.deferredMessage).pipe(
      switchMap(async deferredMessage => await deferredMessage)
    );
  }

  const deferEmbed = (content: string) => {
    const embedTempData = setEmbedData(content, client);
    const embedTempMessage = formatEmbed(embedTempData, client);
  
    interactionInstance.deferredMessage = interaction.options
      ? interaction.deferReply()
      : interaction.channel.send({embeds: [embedTempMessage]});

    return of(interactionInstance.deferredMessage).pipe(
      switchMap(async deferredMessage => await deferredMessage)
    );
  }


  /**
   * Edit
   */

  const editReply = async (content: string) => {
    return interaction.options
      ? interaction.editReply(content)
      : (await interactionInstance.deferredMessage as Message).edit(content);
  }

  const editReplyEmbed = async (content: MessageEmbed) => {
    return interaction.options
      ? interaction.editReply({embeds: [content]})
      : (await interactionInstance.deferredMessage as Message).edit({embeds: [content]});
  }


  /**
   * Send
   */

  const reply = (content: string) => {
    return interaction.options
      ? interaction.reply(content)
      : interaction.channel.send(content);
  }

  const replyEmbed = (content: MessageEmbed) => {
    return interaction.options
      ? interaction.reply({embeds: [content]})
      : interaction.channel.send({embeds: [content]});
  }


  /**
   * Errors
   */

  const errorReply = (content: string) => {
    const embedData = setEmbedData(content, client);
    const embedMsg = formatEmbed(embedData, client);
    
    return replyEmbed(embedMsg);
  }

  const errorEditReply = (content: string) => {
    const embedData = setEmbedData(content, client);
    const embedMsg = formatEmbed(embedData, client);
    
    return editReplyEmbed(embedMsg);
  }


  /**
   * Return Interactions
   */

  return {
    defer,
    deferEmbed,
    editReply,
    editReplyEmbed,
    reply,
    replyEmbed,
    errorReply,
    errorEditReply,
    interactionInstance
  };
}