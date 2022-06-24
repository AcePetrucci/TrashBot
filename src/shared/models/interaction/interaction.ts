import { BaseCommandInteraction, Message } from "discord.js";

import { Either } from '../either';

export type MessageInteraction = Either<BaseCommandInteraction, Message>;

export type IDeferredMessage = Promise<void | Message<boolean>>;
export type InteractionDeferred = {
  deferredMessage?: IDeferredMessage
};