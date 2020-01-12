import { Client, TextChannel } from 'discord.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../../config/typings/types';

import { Observable, from, defer } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class DoujinFinderService {

  private _max = 297270;
  private _min = 20;
  
  findDoujin() {
    return this._doujinGenerator();
  }


  /**
   * Doujin Generator
   */

  private _doujinGenerator() {
    return `https://nhentai.net/g/${this._generateCode()}/`;
  }

  
  /**
   * Code Generator
   */

  private _generateCode() {
    return Math.floor(Math.random() * (this._max - this._min + 1) + this._min);
  }

}