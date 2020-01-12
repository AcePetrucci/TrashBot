import { Message, Client } from 'discord.js';
import { injectable } from 'inversify';

import { from, defer } from 'rxjs';

import { findEmoji } from '../../../../utils/emojis/emojis';

@injectable()
export class TrashCommandsService {

  private _findEmoji;
  private _lastSentMessage = '';

  constructor() { }


  /**
   * Trash Commands Central
   */

  trashCommands(message: Message, client: Client) {
    this._findEmoji = findEmoji(client);
    this._lastSentMessage = message.content.toLowerCase();

    switch (true) {
      case this._lastSentMessage === '!trash':
        return this._trashHelp(message);

      case this._lastSentMessage.includes('!trash scream'):
        return this._trashScream(message);

      default:
        return this._trashInvalidCommand(message);
    }
  }


  /**
   * Trash Help
   */

  private _trashHelp(message: Message) {
    const pepeS = this._findEmoji('PepeS');

    return defer(() => from(message.reply(`Help will come, someday, sometime ${pepeS}`)));
  }


  /**
   * Scream
   */

  private _trashScream(message: Message) {
    const lordsD = this._findEmoji('lordsD');
    const speaker = '\:loudspeaker:';
    const msgToScream = this._lastSentMessage.slice(14);

    return defer(() => from(message.channel.send(`${lordsD} ${speaker}  ${msgToScream.toUpperCase()}`)));
  }


  /**
   * Invalid Command
   */

  private _trashInvalidCommand(message: Message) {
    const smugNep = this._findEmoji('SmugNep');

    return defer(() => from(message.reply(`${smugNep} I can't do this shit (yet) ${smugNep}`)));
  }

}