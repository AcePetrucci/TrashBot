import { GuildBasedChannel, TextChannel } from 'discord.js';

import { IClient, IServerConfig } from 'shared/models';

import { channels } from 'shared/utils';


/**
 * Doujin Channels
 */

export const doujinChannels = () => {
  
  /**
   * Get Bots Channels
   */

  const findBotChannel = async (
    serverConfig: IServerConfig,
    client: IClient
  ) => {
    const guild = await client.guilds.fetch(serverConfig.guildID);

    const isValidBotChannel = (ch: GuildBasedChannel) => (
      channels.includes(ch.name)
      && ch.type === 'GUILD_TEXT'
    );

    return guild.channels.cache.find(isValidBotChannel) as TextChannel;
  }


  /**
   * Return Bot Channel
   */

  return { findBotChannel };
}