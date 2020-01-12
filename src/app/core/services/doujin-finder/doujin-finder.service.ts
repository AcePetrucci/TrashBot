import { injectable } from 'inversify';

import { tags } from '../../../utils/doujins/tags';

@injectable()
export class DoujinFinderService {

  private _doujinURL = 'https://nhentai.net';
  private _max = 297270;
  private _min = 20;
  
  findDoujin() {
    return this._doujinGenerator();
  }

  findTagPage() {
    return this._doujinTagPageGenerator();
  }


  /**
   * Doujin Generator
   */

  private _doujinGenerator() {
    return `${this._doujinURL}/g/${this._generateCode()}`;
  }

  private _doujinTagPageGenerator() {
    return `${this._doujinURL}/tag/${this._generateTag()}`;
  }

  
  /**
   * Code Generator
   */

  private _generateCode() {
    return Math.floor(Math.random() * (this._max - this._min + 1) + this._min);
  }


  /**
   * Tag Generator
   */

  private _generateTag() {
    return tags[Math.floor(Math.random() * tags.length)];
  }

}