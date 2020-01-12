import { injectable } from 'inversify';

import { tags } from '../../../utils/doujins/tags';

import { of, from, defer } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';

import axios from 'axios';

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

  findDoujinByTag(tag: string) {
    return this._doujinByTagGenerator(tag).pipe(tap(console.log));
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

  private _doujinByTagGenerator(tag: string) {
    return this._doujinPageTag(tag).pipe(map(id => `${this._doujinURL}/g/${id}`));
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


  /**
   * Tag Doujin Search
   */

  private _doujinPageTag(tag: string) {
    return defer(() => from(axios.get(`https://nhentai.net/api/galleries/search?query=${tag}`))).pipe(
      map(res => res.data.result[Math.floor(Math.random() * res.data.result.length)].id),
    );
  }

}