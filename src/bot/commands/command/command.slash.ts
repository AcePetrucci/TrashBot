import { Client } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import { defer, from } from 'rxjs';

import pipe from 'lodash/fp/pipe';

import { customCommands } from './command';

import { MessageInteraction } from "shared/models";

export const customCommandsSlash = () => {

  /**
   * Add Command
   */

  const addCustom = () => {
    return new SlashCommandBuilder()
      .setName('command')
      .setDescription('Custom Commands');
  }


  /**
   * Add Get Custom SubCommands
   */

   const addGetCustom = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('get')
      .setDescription('Shows the desired custom command')
      .addStringOption(option => option
        .setName('name')
        .setDescription('dance')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('params')
        .setDescription('X, Y')
      )
    );

    return cmd;
  }

  const addCustomList = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('list')
      .setDescription('Sends a text file showing the list of commands from this server')
    );

    return cmd;
  }


  /**
   * Add Add Custom SubCommands
   */

  const addAddCustom = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('add')
      .setDescription('Adds the desired custom command')
      .addStringOption(option => option
        .setName('name')
        .setDescription('dance')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('text')
        .setDescription('https://dance.gif')
        .setRequired(true)
      )
    );

    return cmd;
  }


  /**
   * Add Delete Custom SubCommands
   */

   const addDeleteCustom = (cmd: SlashCommandBuilder) => {
    cmd.addSubcommand(subCommand => subCommand
      .setName('delete')
      .setDescription('Deletes the desired custom command')
      .addStringOption(option => option
        .setName('name')
        .setDescription('dance')
        .setRequired(true)
      )
    );

    return cmd;
  }


  /**
   * Set Up Slash Commands
   */

  const data = pipe(
    addGetCustom,
    addCustomList,
    addAddCustom,
    addDeleteCustom
  )(addCustom());
 


  /**
   * Execute Slash Commands
   */

  const trigger = (interaction: MessageInteraction, client: Client) => {
    const { slashCommands } = customCommands();

    return defer(() => from(slashCommands(interaction, client)));
  };


  /**
   * Return Slash Properties
   */

  return { data, trigger };
}