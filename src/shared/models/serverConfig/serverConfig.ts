import { TextChannel } from 'discord.js';
import { BehaviorSubject } from 'rxjs';

export type IServerConfig = {
  id: string;
  guildID?: string;
  nhenDisable: boolean;
  nhenTimer: boolean;
}

export type IGuildServerConfig = {
  guildID: string;
  config: IServerConfig | null;
}

export type IChannelServerConfig = {
  channel: TextChannel;
  config: IServerConfig | null;
}

export type INhenServerConfig = {
  serverConfig: IServerConfig;
  timer: BehaviorSubject<number>;
}