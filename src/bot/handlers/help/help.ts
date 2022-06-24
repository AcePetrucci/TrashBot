import { EmbedFieldData } from "discord.js";

import { IClient, MessageInteraction } from "shared/models";

import {
  setEmbedHelpData,
  formatEmbedHelp,
} from 'shared/utils';

import { interactionHandler } from '../interaction';


/**
 * Help Handler
 */

export const helpHandler = (
  interaction: MessageInteraction,
  client: IClient
) => {

  const { replyEmbed } = interactionHandler(interaction, client);


  /**
   * Help Reply
   */

  const helpReply = (
    embedField: EmbedFieldData,
    type: string
  ) => {
    const embedHelpData = setEmbedHelpData(type, embedField, client);
    const embedHelpMessage = formatEmbedHelp(embedHelpData, client);

    return replyEmbed(embedHelpMessage);
  }


  /**
   * Return Help Handler
   */

  return { helpReply };
}