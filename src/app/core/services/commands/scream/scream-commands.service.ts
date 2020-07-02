import { Message, Client } from 'discord.js';
import { injectable } from 'inversify';

import { from, defer } from 'rxjs';

import { findEmoji } from '../../../../utils/emojis/emojis';

@injectable()
export class ScreamCommandsService {

  private _findEmoji;

  constructor() { }


  /**
   * Scream Commands Central
   */

  screamCommands(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);

    return this._trashScream(message);
  }


  /**
   * Scream
   */

  private _trashScream(message: Message, fixedMsg?: string) {
    const lordsD = this._findEmoji('lordsD');
    const speaker = '\:loudspeaker:';
    const msgToScream = fixedMsg ?? message.content.slice(8);

    message.delete();

    return defer(() => from(message.channel.send(`${lordsD} ${speaker}  ${msgToScream.toUpperCase()}`)));
  }

}