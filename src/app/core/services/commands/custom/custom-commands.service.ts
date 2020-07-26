import { Message, Client } from 'discord.js';
import { injectable, inject } from 'inversify';

import { from, defer } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import { findEmoji } from '../../../../utils/emojis/emojis';
import { formatQuote, sendQuote } from '../../../../utils/quotes/quotes';
import { sendError } from '../../../../utils/errors/errors';

import TYPES from '../../../../../config/types/types';

import axios from 'axios';
import { memory } from 'console';

@injectable()
export class CustomCommandsService {

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
      map(({data: {data: {createCommand: quote}}}) => formatQuote(`Command !${quote.commandName} has been created.`)),
      switchMap(quote => sendQuote(quote, message, client)),
      catchError(err => sendError('Could not create the command. Are you sure you followed the guidelines?', message, client))
    ));
  }

  private _addCustomCommandHelp(message: Message, client: Client) {
    const peepoSmart = this._findEmoji('peepoSmart');

    return defer(() => from(message.channel.send({embed: {
      color: 0xec407a,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: `${peepoSmart} TrashBot AddCommand Help ${peepoSmart}`,
      fields: [
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
      ]
    }})))
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
      switchMap(({data: {data: {findCommand: command}}}) => message.channel.send(command.commandText)),
      catchError(err => sendError('There was an error trying to fetch this command. Are you sure it does exist?', message, client))
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
      map(({data: {data: {deleteByNameCommand: command}}}) => formatQuote(`Command !${command.commandName} has been deleted.`)),
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
      map(({data: {data: {findAllCommands: commands}}}) => this._createCommandsList(commands, message)),
      switchMap(commandsList => this._formatCommandsList(commandsList.join('\n\n'), client, message)),
      catchError(err => sendError('It seems this server has no commands saved yet. Type *!addcommand* to see how to add one.', message, client))
    ))
  }


  private _createCommandsList(commands, message: Message) {
    return commands.map(command => {
      const author = message.guild.members.find(member => member.user.id === command.authorID);

      return `!${command.commandName}: ${command.commandText} - ${author?.nickname ?? author?.user.username} - ${new Date(command.createdAt).toLocaleDateString()}`;
    })
  }

  private _formatCommandsList(commandsList, client: Client, message: Message) {
    return message.author.send(`\`\`\`*** ${message.guild.name.toUpperCase()} COMMANDS LIST *** \n \n \n${commandsList}\`\`\``);
  }

}