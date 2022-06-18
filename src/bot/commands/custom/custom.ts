import { Message, Client, MessageEmbed } from 'discord.js';
import { injectable, inject } from 'inversify';
import axios from 'axios';

import { from, defer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import {
  findEmoji,
  formatQuote,
  sendQuote,
  sendError
} from 'shared/utils';

import { TYPES } from 'shared/config/types';

@injectable()
export class CustomCommands {

  private _findEmoji;
  private _guildID: string;
  private readonly _quoteAPIUrl: string;

  constructor(
    @inject(TYPES.QuoteAPIUrl) quoteAPIUrl: string
  ) {
    this._quoteAPIUrl = quoteAPIUrl;
  }


  /**
   * Add Custom Commands Central
   */

  addCustomCommandsHandler(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);
    this._guildID = message.guild.id;

    switch (true) {
      case ((message.content === '!addcommand -h') || (message.content === '!addcommand')):
        return this._addCustomCommandHelp(message, client);

      default:
        return this._addCustomCommand(message, client);
    }
  }


  /**
   * Get Custom Commands Central
   */

  getCustomCommandsHandler(message: Message, client: Client) {
    this._guildID = message.guild.id;

    switch (true) {
      case (message.content === '!commandslist'):
        return this._getCustomCommandsList(message, client);

      case (message.content.includes('!dcommand')):
        return this._deleteCustomCommand(message, client);

      case (message.content === '!' || message.content.includes('!!')):
        return;

      default:
        return this._getCustomCommand(message, client);
    }
  }


  /**
   * Add Custom Command
   */

  private _addCustomCommand(message: Message, client: Client) {
    const authorID = message.author.id;
    const [commandName, commandText] = message.content.slice(12).split(' - ');

    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `mutation {
        createCommand(command: {
          authorID: "${authorID}",
          guildID: "${this._guildID}",
          commandName: "${commandName}",
          commandText: "${commandText}"
        }) {
          commandName
        }
      }`,
    })).pipe(
      map(({ data: { data: { createCommand: quote } } }) => formatQuote(`Command !${quote.commandName} has been created.`)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('Could not create the command. Are you sure you followed the guidelines?', message, client))
    ));
  }

  private _addCustomCommandHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    const embed = new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL()
      })
      .setTitle(`${peepoSmart} TrashBot AddCommand Help ${peepoSmart}`)
      .setFields([
        {
          name: 'Commands',
          value: `
            **!addcommand** or **!addcommand -h**
            Shows the addcommand help panel (this one right here).

            **!addcommand <commmand_name> - <command_text>**
            Ex: *!addcommand macaco - Eu vim ver o macaco*
            Adds the specified command with the given text. You can also add server emotes as a command text.

            **!dcommand <commmand_name>**
            Ex: *!dcommand macaco*
            Deletes the specified command.

            **!commandslist**
            Shows the server's command list.
          `,
        },
      ]);

    return defer(() => from(message.channel.send({
      embeds: [embed]
    })))
  }


  /**
   * Get Custom Command
   */

  private _getCustomCommand(message: Message, client: Client) {
    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `query {
        findCommand(commandName: "${message.content.slice(1)}", guildID: "${this._guildID}") { commandText }
      }`,
    })).pipe(
      switchMap(({ data: { data: { findCommand: command } } }) => message.channel.send(command.commandText)),
      catchError(err => Promise.reject())
    ));
  }


  /**
   * Delete Command
   */

  private _deleteCustomCommand(message: Message, client: Client) {
    const commandName = message.content.slice(10);

    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `mutation {
        deleteByNameCommand(commandName: "${commandName}", guildID: "${this._guildID}") {
          authorID,
          commandName,
          commandText,
          createdAt
        }
      }`,
    })).pipe(
      switchMap(({ data: { data: { deleteByNameCommand: command } } }) => formatQuote(`Command !${command.commandName} has been deleted.`)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('Could not delete the command. Did you get the command name right?', message, client))
    ))
  }


  /**
   * Get Command List
   */

  private _getCustomCommandsList(message: Message, client: Client) {
    return defer(() => from(axios.post(this._quoteAPIUrl, {
      query: `query {
        findAllCommands(guildID: "${this._guildID}") {
          authorID,
          commandName,
          commandText,
          createdAt
        }
      }`,
    })).pipe(
      map(({ data: { data: { findAllCommands: commands } } }) => this._createCommandsList(commands, message)),
      switchMap(commandsList => this._formatCommandsList(commandsList, client, message)),
      catchError(err => sendError('It seems this server has no commands saved yet. Type *!addcommand* to see how to add one.', message, client))
    ))
  }


  private _createCommandsList(commands, message: Message) {
    return commands.map(command => {
      const author = message.guild.members.cache.find(member => member.user.id === command.authorID);

      return `!${command.commandName}: ${command.commandText} - ${author?.nickname ?? author?.user.username} - ${new Date(command.createdAt).toLocaleDateString()}`;
    })
  }

  private _formatCommandsList(commandsList: string[], client: Client, message: Message) {
    const pagedCommandsList = this._getPagedCommandsList(commandsList, []);

    return pagedCommandsList.map(pagedCommands => {
      return message.author.send(`\`\`\`*** ${message.guild.name.toUpperCase()} COMMANDS LIST *** \n \n \n${pagedCommands.join('\n\n')}\`\`\``);
    })
  }

  private _getPagedCommandsList(commandsList: string[], pagedCommands: string[][]): string[][] {
    let charCount = 0;

    const newPagedCommands = commandsList.filter(commandEntry => {
      return (charCount += commandEntry.length) <= 1900
    })

    const remainingCommandsList = commandsList.slice(
      commandsList.findIndex(commandEntry => (
        commandEntry === newPagedCommands[newPagedCommands.length - 1]
      )) + 1
    )

    return remainingCommandsList.length
      ? this._getPagedCommandsList(remainingCommandsList, pagedCommands.concat([newPagedCommands]))
      : pagedCommands.concat([newPagedCommands]);
  }

}