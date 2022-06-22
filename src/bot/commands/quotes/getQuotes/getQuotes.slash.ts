import { Client } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import { defer, from } from 'rxjs';

import pipe from 'lodash/fp/pipe';

import { getQuotesCommands } from './getQuotes';

import { MessageInteraction } from "shared/models";

export const getQuotesCommandsSlash = () => {

  /**
   * Add Command
   */

  const addQuote = () => {
    return new SlashCommandBuilder()
      .setName('quote')
      .setDescription('Shows a random quote from this server');
  }


  /**
   * Add SubCommands
   */

  const addRandom = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('random')
      .setDescription('Shows a random quote from this server')
    );

    return cmd;
  }

  const addQuoteByIndex = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('search-by-index')
      .setDescription('Shows a specific quote from this server based on the index')
      .addStringOption(option => option
        .setName('quote-index')
        .setDescription('1')
        .setRequired(true)
      )
    );

    return cmd;
  }

  const addQuoteByText = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('search-by-text')
      .setDescription('Shows a random quote from this server which contains the specified quote text')
      .addStringOption(option => option
        .setName('quote-text')
        .setDescription('Quote Text')
        .setRequired(true)
      )
    );

    return cmd;
  }

  const addQuoteList = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('list')
      .setDescription('Sends a DM showing the list of quotes from this server')
    );

    return cmd;
  }

  const addQuoteRatio = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('ratio')
      .setDescription('Shows the ratio of quotes for the mentioned user compared to the server')
      .addUserOption(option => option
        .setName('quote-author')  
        .setDescription('@User')
        .setRequired(true)
      )
    );

    return cmd;
  }


  /**
   * Set Up Slash Commands
   */

  const data = pipe(
    addRandom,
    addQuoteByIndex,
    addQuoteByText,
    addQuoteList,
    addQuoteRatio
  )(addQuote());
 


  /**
   * Execute Slash Commands
   */

  const trigger = (interaction: MessageInteraction, client: Client) => {
    const { slashCommands } = getQuotesCommands();

    return defer(() => from(slashCommands(interaction, client)));
  };


  /**
   * Return Slash Properties
   */

  return { data, trigger };
}