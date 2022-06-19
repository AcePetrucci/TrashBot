import { Client } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";

import { defer, from } from 'rxjs';

import pipe from 'lodash/fp/pipe';

import { nhCommands } from 'bot/commands/nh';

import { MessageInteraction } from "shared/models/interaction";

export const nhCommandsSlash = () => {

  
  /**
   * Add Command
   */

  const addNh = () => {
    return new SlashCommandBuilder()
      .setName('nh')
      .setDescription('Search for a random NH tag and return its page');
  }


  /**
   * Add SubCommands
   */

  const addRandom = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('random')
      .setDescription('Search for a random NH doujin')
    );

    return cmd;
  }

  const addRandomTag = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('random-tag')
      .setDescription('Search for a random NH tag and return its page')
    );

    return cmd;
  }

  const addSearchByTag = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('search-by-tag')
      .setDescription('Search for a specific tag and return a random doujin which contains the specified tag(s)')
      .addStringOption(option => option
        .setName('tags')
        .setDescription('yuri english')
        .setRequired(true)
      )
    );

    return cmd;
  }

  const addEnable = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('enable')
      .setDescription('Enables the !nh auto timer, allowing the bot of sending random nh at any given amount of time')
    );

    return cmd;
  }

  const addDisable = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('disable')
      .setDescription('Disables the !nh auto timer, preventing the bot of sending random nh at any given amount of time')
    );

    return cmd;
  }


  /**
   * Set Up Slash Commands
   */

  const data = pipe(
    addRandom,
    addRandomTag,
    addSearchByTag,
    addEnable,
    addDisable
  )(addNh());
 


  /**
   * Execute Slash Commands
   */

  const trigger = (interaction: MessageInteraction, client: Client) => {
    const { slashCommands } = nhCommands();

    return defer(() => from(slashCommands(interaction, client)));
  };


  /**
   * Return Slash Properties
   */

  return { data, trigger };
}