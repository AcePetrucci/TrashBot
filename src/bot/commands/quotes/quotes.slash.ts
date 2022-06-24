import { Client } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import { defer, from } from 'rxjs';

import pipe from 'lodash/fp/pipe';

import { quotesCommands } from './quotes';

import { MessageInteraction } from "shared/models";

export const quotesCommandsSlash = () => {

  /**
   * Add Command
   */

  const addQuote = () => {
    return new SlashCommandBuilder()
      .setName('quote')
      .setDescription('Shows a random quote from this server');
  }


  /**
   * Add Get Quotes SubCommands
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
      .addIntegerOption(option => option
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
        .setDescription('Trash')
        .setRequired(true)
      )
    );

    return cmd;
  }

  const addQuoteList = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('list')
      .setDescription('Sends a text file showing the list of quotes from this server')
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
   * Add Add Quotes SubCommands
   */

   const addAddQuote = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('add')
      .setDescription('Adds a quote to this server')
      .addStringOption(option => option
        .setName('quote-text')  
        .setDescription('This bot is truly trash')
        .setRequired(true)
      )
      .addUserOption(option => option
        .setName('quote-author')  
        .setDescription('@User')
        .setRequired(true)
      )
    );

    return cmd;
  }


  /**
   * Add Delete Quotes SubCommands
   */

   const addDeleteQuote = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('delete')
      .setDescription('Deletes a quote from this server')
      .addIntegerOption(option => option
        .setName('quote-index')
        .setDescription('1')
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
    addQuoteRatio,
    addAddQuote,
    addDeleteQuote
  )(addQuote());
 


  /**
   * Execute Slash Commands
   */

  const trigger = (interaction: MessageInteraction, client: Client) => {
    const { slashCommands } = quotesCommands();

    return defer(() => from(slashCommands(interaction, client)));
  };


  /**
   * Return Slash Properties
   */

  return { data, trigger };
}