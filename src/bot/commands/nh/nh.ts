import { Client, CommandInteractionOption, Message } from "discord.js";
import { catchError, from, switchMap, of, map, tap, defer } from "rxjs";

import axios from 'axios';

import { MessageInteraction } from "shared/models/interaction";

import { doujinFinderService } from 'bot/services';

import {
  interactionReply,
  interactionReplyEmbed,
  formatEmbed,
  setEmbedData,
  sendErrorEmbed
} from 'shared/utils';

export const nhCommands = () => {
  const _quoteAPIUrl: string = process.env.QUOTE_API;
  let _guildID: string;

  const {
    findDoujinByTag,
    findTagPage,
    findDoujin
  } = doujinFinderService();


  /**
   * Legacy Commands
   */

  const legacyCommands = (message: MessageInteraction, client: Client) => {
    _guildID = message.guildId;

    switch (true) {
      case message.content === '!nh':
        return _nhRandomDoujin(message);

      case message.content.startsWith('!nh tag'):
        return _nhRandomTag(message);

      case message.content.startsWith('!nh -h'):
        return Promise.resolve();

      case message.content.startsWith('!nh disable'):
        return _nhToggle(message, client, true);

      case message.content.startsWith('!nh enable'):
        return _nhToggle(message, client, false);

      default:
        return _nhDoujinByTag(message);
    }
  }


  /**
   * Slash Commands
   */

  const slashCommands = (interaction: MessageInteraction, client: Client) => {
    _guildID = interaction.guildId;

    const subInteraction = interaction.options.data[0];

    switch (true) {
      case subInteraction.name === 'random':
        return _nhRandomDoujin(interaction);

      case subInteraction.name === 'random-tag':
        return _nhRandomTag(interaction);

      case subInteraction.name === 'search-by-tag':
        return _nhDoujinByTag(interaction, subInteraction.options);

      case subInteraction.name === 'disable':
        return _nhToggle(interaction, client, true);

      case subInteraction.name === 'enable':
        return _nhToggle(interaction, client, false);

      default:
        return Promise.resolve();
    }
  }


  /**
   * NH Random Doujin
   */

   const _nhRandomDoujin = (interaction: MessageInteraction) => {
    return interactionReply(interaction, findDoujin());
  }


  /**
   * NH Random Tag
   */

  const _nhRandomTag = (interaction: MessageInteraction) => {
    return interactionReply(interaction, findTagPage());
  }


  /**
   * NH Doujin by Tag
   */

   const _nhDoujinByTag = (interaction: MessageInteraction, options?: CommandInteractionOption[]) => {
    const tags = options
      ? options.find(({name}) => name === 'tags').value as string
      : interaction.content.split(' ').slice(1).join(' ');

    return findDoujinByTag(tags).pipe(
      switchMap(doujin => interactionReply(interaction, doujin)),
      catchError(err => interactionReply(interaction, 'It seems your tag search doesn\'t exist'))
    );
  }


  /**
   * NH Toggle
   */

   const _nhToggle = (interaction: MessageInteraction, client: Client, disabled: boolean) => {
    return defer(() => from(axios.post(_quoteAPIUrl, {
      query: `mutation {
        toggleNh(guildID: "${_guildID}", disabled: ${disabled}) {
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      map(() => setEmbedData(client, `This server has ${disabled ? 'disabled' : 'enabled'} the !nh timer`)),
      map(embedData => formatEmbed(embedData, client)),
      switchMap(embedMsg => interactionReplyEmbed(interaction, embedMsg)),
      catchError(err => sendErrorEmbed(interaction, client, 'Could not update the server config.'))
    ));
  }
  


  /**
   * Return Commands
   */

  return { legacyCommands, slashCommands };
}