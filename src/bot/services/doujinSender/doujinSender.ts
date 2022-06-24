import { BehaviorSubject, interval } from "rxjs";
import { switchMap, tap } from 'rxjs/operators';

import { doujinFinderService } from 'bot/services/doujinFinder';

import {
  IClient,
  INhenServerConfig,
  IServerConfig
} from "shared/models";

import {
  doujinChannels,
  doujinTimer,
  doujinInstance
} from './utils';



/**
 * Doujin Sender Server
 */

export const doujinSenderService = () => {

  const { findDoujin } = doujinFinderService();

  const { findBotChannel } = doujinChannels();
  const { generateTimer, refreshTimer } = doujinTimer();
  const { getInstance } = doujinInstance();


  /**
   * Send Doujin
   */

  const sendDoujin = (
    serverConfig: IServerConfig,
    client: IClient
  ) => {
    const nhenServerConfig: INhenServerConfig = {
      serverConfig,
      timer: new BehaviorSubject<number>(generateTimer())
    };

    return nhenServerConfig.timer.pipe(
      switchMap(timer => interval(timer)),
      switchMap(() => findBotChannel(serverConfig, client)),
      switchMap(channel => getInstance(channel, serverConfig.guildID)),
      switchMap(instance => instance.config.nhenDisable
        ? Promise.resolve()
        : instance.channel.send(findDoujin())
      ),
      tap(() => refreshTimer(nhenServerConfig)),
    )
  }


  /**
   * Return Daily Doujin
   */

  return { sendDoujin };
}