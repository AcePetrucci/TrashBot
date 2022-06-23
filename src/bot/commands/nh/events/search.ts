import { CommandInteractionOption } from "discord.js";
import { switchMap, catchError } from 'rxjs/operators';

import { doujinFinderService } from 'bot/services';

import { MessageInteraction } from "shared/models";

import {
  interactionHandler
} from 'bot/handlers';


/**
 * NH Search Events
 */

export const nhSearchEvents = () => {

  const {
    findDoujinByTag,
    findTagPage,
    findDoujin
  } = doujinFinderService();


  /**
   * NH Random Doujin
   */

  const nhRandomDoujin = (interaction: MessageInteraction) => {
    const {
      defer,
      editReply,
      errorEditReply
    } = interactionHandler(interaction);

    return defer('Retrieving a random doujin...').pipe(
      switchMap(() => editReply(findDoujin())),
      catchError(err => errorEditReply('Something gone wrong while trying to get a doujin :c'))
    );
  }


  /**
   * NH Random Tag
   */

  const nhRandomTag = (interaction: MessageInteraction) => {
    const {
      defer,
      editReply,
      errorEditReply
    } = interactionHandler(interaction);

    return defer('Retrieving a random tag...').pipe(
      switchMap(() => editReply(findTagPage())),
      catchError(err => errorEditReply('Something gone wrong while trying to get a tag :c'))
    );
  }


  /**
   * NH Doujin by Tag
   */

   const nhDoujinByTag = (interaction: MessageInteraction, options?: CommandInteractionOption[]) => {
    const {
      defer,
      editReply,
      errorEditReply
    } = interactionHandler(interaction);

    const tags = options
      ? options.find(({name}) => name === 'tags').value as string
      : interaction.content.split(' ').slice(1).join(' ');

    return defer('Retrieving a doujin with the mentioned tag(s)...').pipe(
      switchMap(() => findDoujinByTag(tags)),
      switchMap(doujin => editReply(doujin)),
      catchError(err => errorEditReply('It seems your tag search doesn\'t exist'))
    );
  }


  /**
   * Return NH Search Events
   */

  return {
    nhRandomDoujin,
    nhRandomTag,
    nhDoujinByTag
  }
}