import { BehaviorSubject } from 'rxjs';

export type IServerConfig = {
  id: string;
  guildID?: string;
  nhenDisable: boolean;
  nhenTimer: boolean;
}

export type IGetServerConfig = {
  guildID: string;
  config: IServerConfig | null;
}

export type INhenServerConfig = {
  serverConfig: IServerConfig;
  timer: BehaviorSubject<number>;
}