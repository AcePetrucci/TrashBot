import { BaseCommandInteraction, Message } from "discord.js";

import { Either } from '../either';

export type MessageInteraction = Either<BaseCommandInteraction, Message>;

export type InteractionDeferred = void | Message<boolean>;