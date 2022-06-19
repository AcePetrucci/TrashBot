import { CommandInteractionOption } from "discord.js";
import { catchError, switchMap } from "rxjs";

import { doujinFinderService } from 'bot/services';

import { MessageInteraction } from "shared/models/interaction";

import { interactionReply } from 'shared/utils';


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
    return interactionReply(findDoujin(), interaction);
  }


  /**
   * NH Random Tag
   */

  const nhRandomTag = (interaction: MessageInteraction) => {
    return interactionReply(findTagPage(), interaction);
  }


  /**
   * NH Doujin by Tag
   */

   const nhDoujinByTag = (interaction: MessageInteraction, options?: CommandInteractionOption[]) => {
    const tags = options
      ? options.find(({name}) => name === 'tags').value as string
      : interaction.content.split(' ').slice(1).join(' ');

    return findDoujinByTag(tags).pipe(
      switchMap(doujin => interactionReply(doujin, interaction)),
      catchError(err => interactionReply('It seems your tag search doesn\'t exist', interaction))
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