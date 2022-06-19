import { GuildBasedChannel, TextChannel } from "discord.js";

import axios from "axios";

import { BehaviorSubject, defer, from, interval, Observable } from "rxjs";
import { map, switchMap, tap } from 'rxjs/operators';

import {
  IClient,
  INhenServerConfig,
  IServerConfig
} from "shared/models";

import { channels } from 'shared/utils';

import { doujinFinderService } from 'bot/services/doujinFinder';



/**
 * Doujin Sender Server
 */

export const doujinSenderService = () => {

  const _quoteAPIUrl = process.env.QUOTE_API;

  const _dayMs = 1000 * 60 * 60 * 24;
  const _lastTimer = 0;
  const _incrementMs = 16000000;
  const _generateTimer = () => Math.floor(Math.random() * _dayMs + 1);

  const { findDoujin } = doujinFinderService();


  /**
   * Send Doujin
   */

  const sendDoujin = (
    serverConfig: IServerConfig,
    client: IClient
  ) => {
    const nhenServerConfig: INhenServerConfig = {
      serverConfig,
      timer: new BehaviorSubject<number>(_generateTimer())
    };

    return nhenServerConfig.timer.pipe(
      switchMap(timer => interval(timer)),
      switchMap(() => _prepareChannel(serverConfig, client)),
      switchMap(channel => _getServerConfig(serverConfig.guildID).pipe(
        map(updatedServerConfig => ({channel, updatedServerConfig}))
      )),
      switchMap(instance => instance.updatedServerConfig.nhenDisable
        ? Promise.resolve()
        : instance.channel.send(findDoujin())
      ),
      tap(() => _refreshTimer(nhenServerConfig)),
    )
  }


  /**
   * Prepare Channel
   */

  const _prepareChannel = (
    serverConfig: IServerConfig,
    client: IClient
  ) => {
    return defer(() => from(_findBotChannel(serverConfig, client)))
  }


  /**
   * Get Bots Channels
   */

  const _findBotChannel = async (
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
   * Refresh Server Config
   */

  const _getServerConfig = (
    guildID: string
  ): Observable<IServerConfig> => {
    return from(axios.post(_quoteAPIUrl, {
      query: `query {
        findServerConfig(guildID: "${guildID}") {
          id,
          guildID,
          nhenDisable,
          nhenTimer
        }
      }`,
    })).pipe(
      map(({data}) => data.data.findServerConfig)
    );
  }


  /**
   * Refresh Timer
   */

  const _refreshTimer = (
    nhenServerConfig: INhenServerConfig,
    needToIncrement = 0
  ) => {
    const generatedTimer = _generateTimer();

    return (generatedTimer + _lastTimer + needToIncrement) > _dayMs
      ? nhenServerConfig.timer.next(generatedTimer)
      : _refreshTimer(nhenServerConfig, needToIncrement + _incrementMs);
  }


  /**
   * Return Daily Doujin
   */

  return { sendDoujin };
}