import { CommandInteractionOption } from "discord.js";
import { catchError, switchMap } from "rxjs";

import { doujinFinderService } from 'bot/services';

import { MessageInteraction } from "shared/models";

import { interactionHandler } from 'shared/utils';


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
      interactionDefer,
      interactionEditReply,
      interactionErrorEditReply
    } = interactionHandler(interaction);

    return interactionDefer('Retrieving a random doujin...').pipe(
      switchMap(() => interactionEditReply(findDoujin())),
      catchError(err => interactionErrorEditReply('Something gone wrong while trying to get a doujin :c'))
    );
  }


  /**
   * NH Random Tag
   */

  const nhRandomTag = (interaction: MessageInteraction) => {
    const {
      interactionDefer,
      interactionEditReply,
      interactionErrorEditReply
    } = interactionHandler(interaction);

    return interactionDefer('Retrieving a random tag...').pipe(
      switchMap(() => interactionEditReply(findTagPage())),
      catchError(err => interactionErrorEditReply('Something gone wrong while trying to get a tag :c'))
    );
  }


  /**
   * NH Doujin by Tag
   */

   const nhDoujinByTag = (interaction: MessageInteraction, options?: CommandInteractionOption[]) => {
    const {
      interactionDefer,
      interactionEditReply,
      interactionErrorEditReply
    } = interactionHandler(interaction);

    const tags = options
      ? options.find(({name}) => name === 'tags').value as string
      : interaction.content.split(' ').slice(1).join(' ');

    return interactionDefer('Retrieving a doujin with the mentioned tag(s)...').pipe(
      switchMap(() => findDoujinByTag(tags)),
      switchMap(doujin => interactionEditReply(doujin)),
      catchError(err => interactionErrorEditReply('It seems your tag search doesn\'t exist'))
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