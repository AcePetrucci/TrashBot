import { BaseCommandInteraction, Message } from "discord.js";

type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: U[P];
};

type Either<T, U> = Only<T, U> | Only<U, T>;

export type MessageInteraction = Either<BaseCommandInteraction, Message>;