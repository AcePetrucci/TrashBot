import { injectable, inject } from 'inversify';

import { tags } from '../../../utils/doujins/tags';

import { TYPES } from '../../../../config/typings/types';

import { of, from, defer, Observable } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';

import axios from 'axios';

@injectable()
export class DoujinFinderService {

  private readonly _doujinUrl: string;

  private _max = 297270;
  private _min = 20;

  constructor(
    @inject(TYPES.DoujinUrl) doujinUrl: string
  ) {
    this._doujinUrl = doujinUrl;
  }
  
  findDoujin() {
    return this._doujinGenerator();
  }

  findTagPage() {
    return this._doujinTagPageGenerator();
  }

  findDoujinByTag(tag: string) {
    return this._doujinByTagGenerator(tag);
  }


  /**
   * Doujin Generator
   */

  private _doujinGenerator() {
    return `${this._doujinUrl}/g/${this._generateCode()}`;
  }

  private _doujinTagPageGenerator() {
    return `${this._doujinUrl}/tag/${this._generateTag()}`;
  }

  private _doujinByTagGenerator(tag: string) {
    return this._doujinPageTag(tag).pipe(map(id => `${this._doujinUrl}/g/${id}`));
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

  private _doujinPageTag(tag: string): Observable<number> {
    return defer(() => from(axios.get(`${this._doujinUrl}/api/galleries/search?query=${tag}`))).pipe(
      map(res => res.data.result[Math.floor(Math.random() * res.data.result.length)].id),
    );
  }

}