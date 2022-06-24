import { TextChannel } from "discord.js";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { serverConfigService } from "bot/services/serverConfig"

import { IChannelServerConfig } from 'shared/models';


/**
 * Doujin Instance
 */

export const doujinInstance = () => {

  const { getServerConfig } = serverConfigService();

  /**
   * Get Instance
   */

  const getInstance = (
    channel: TextChannel,
    guildID: string,
  ): Observable<IChannelServerConfig> => {
    return getServerConfig(guildID).pipe(
      map(updatedServerConfig => ({channel, config: updatedServerConfig}))
    )
  }


  /**
   * Return Instance
   */

  return { getInstance };
}