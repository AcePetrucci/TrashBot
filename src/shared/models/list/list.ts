import { IClient } from "../client";
import { IEmbed } from "../embed";
import { MessageInteraction } from "../interaction";

export type IListType = 'Quotes' | 'Commands' | 'Custom Commands';

export type IListSetter = (listItem: any) => Promise<IEmbed>;