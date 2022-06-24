import axios from 'axios';

import { from, defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { tags } from 'shared/utils';


export const doujinFinderService = () => {

  const _doujinUrl: string = process.env.DOUJIN_URL;

  const _max = 297270;
  const _min = 20;


  /**
   * Main Doujin Methods
   */

  const findDoujin = () => {
    return _doujinGenerator();
  }

  const findTagPage = () => {
    return _doujinTagPageGenerator();
  }

  const findDoujinByTag = (tag: string) => {
    return _doujinByTagGenerator(tag);
  }


  /**
   * Doujin Generator
   */

  const _doujinGenerator = () => {
    return `${_doujinUrl}/g/${_generateCode()}`;
  }

  const _doujinTagPageGenerator = () => {
    return `${_doujinUrl}/tag/${_generateTag()}`;
  }

  const _doujinByTagGenerator = (tag: string) => {
    return _doujinPageTag(tag).pipe(map(id => `${_doujinUrl}/g/${id}`));
  }


  /**
   * Code Generator
   */

  const _generateCode = () => {
    return Math.floor(Math.random() * (_max - _min + 1) + _min);
  }


  /**
   * Tag Generator
   */

  const _generateTag = () => {
    return tags[Math.floor(Math.random() * tags.length)];
  }


  /**
   * Tag Doujin Search
   */

  const _doujinPageTag = (tag: string): Observable<number> => {
    return defer(() => from(axios.get(`${_doujinUrl}/api/galleries/search?query=${tag}`))).pipe(
      map(res => res.data.result[Math.floor(Math.random() * res.data.result.length)].id),
    );
  }


  /**
   * Return Doujin Methods
   */

  return { findDoujin, findTagPage, findDoujinByTag };
}