import { MessageEmbed } from 'discord.js';

import { memoize } from 'lodash/fp';

import {
  IClient,
  ICustom,
  IEmbed,
  IEmbedCustom,
  MessageInteraction,
} from "shared/models";


/**
 * Custom Handler
 */

export const customHandler = (
  interaction: MessageInteraction,
  client: IClient
) => {

  const midiaExts = ['.webp', '.png', '.jpg', '.jpeg', '.gif']


  /**
   * Format Custom
   */

  const formatCustom = memoize((
    command: ICustom,
    commandParams?: string[]
  ) => {
    if (command.commandText && command.authorID) {
      command.commandText = _getCommadsCustomParams(command, commandParams);
    }

    const commandData = _setCustomData(command);

    return formatCustomEmbed(commandData, client);
  })


  /**
   * Command Custom Params
   */

  const _getCommadsCustomParams = memoize((
    command: ICustom,
    commandParams?: string[]
  ) => {
    const textParams = [
      ...new Set(command.commandText.split(' ')
        .filter(excerpt => excerpt.startsWith('${'))
        .map(textParam => textParam.replace(',', '')))
    ];

    if (textParams.length && !commandParams?.length) {
      return 'This custom command needs additional parameters';
    }

    const paramsMap = new Map();

    textParams.forEach((textParam, textParamIndex) => {
      paramsMap.set(textParam, commandParams.at(textParamIndex).replace(',', ''))
    });

    const parsedCommand = command.commandText.split(' ')
      .map(excerpt => excerpt.startsWith('${')
        ? paramsMap.get(excerpt).concat(excerpt.includes(',') ? ',' : '')
        : excerpt
      )
      .join(' ');

    return parsedCommand;
  })


  /**
   * Set Command Data
   */

  const _setCustomData = memoize((
    command: ICustom,
  ): IEmbedCustom => {
    const midia = midiaExts.some(ext => command.commandText?.includes(ext));

    return command.commandText
      ? {
        text: midia ? '' : command.commandText,
        author: `Command: !${command.commandName}`,
        authorAvatar: interaction.guild.iconURL(),
        date: new Date(command.createdAt),
        image: midia ? command.commandText : ''
      }
      : {
        text: `Command !${command.commandName} has been deleted.`,
        author: interaction.guild.name,
        authorAvatar: interaction.guild.iconURL(),
        date: new Date(),
        image: ''
      }
  })

  const setCustomListData = memoize(async (
    command: ICustom,
  ): Promise<IEmbed> => {
    const author = await _fetchMember(command.authorID);

    return {
      text: `!${command.commandName}: ${command.commandText}`,
      author: author,
      date: new Date(command.createdAt),
    }
  })


  /**
   * Fetch Server Member
   */

  const _fetchMember = memoize(async (
    authorID: string
  ) => {
    let authorName: string;

    try {
      const author = await interaction.guild.members.fetch(authorID);
      
      authorName = author.displayName;
    } catch {
      authorName = '[REDACTED]';
    };

    return authorName;
  })


  /**
   * Format Command Embed Data
   */

  const formatCustomEmbed = (
    embedData: IEmbedCustom,
    client: IClient
  ) => {
    return new MessageEmbed()
      .setColor(0xec407a)
      .setAuthor({
        name: embedData.author,
        iconURL: embedData.authorAvatar ?? client.user.displayAvatarURL()
      })
      .setTitle(embedData.text)
      .setImage(embedData.image)
      .setTimestamp(embedData.date);
  }


  /**
   * Return Custom Handler
   */

  return { formatCustom, setCustomListData };
}