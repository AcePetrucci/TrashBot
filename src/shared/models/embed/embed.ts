import { EmbedFieldData } from "discord.js";

export type IEmbed = {
  text: string;
  author: string;
  authorAvatar?: string;
  date: Date;
  description?: string;
}

export type IEmbedHelp = {
  title?: string;
  author: string;
  authorAvatar: string;
  fields: EmbedFieldData[];
}

export type IEmbedCustom = {
  text?: string;
  author?: string;
  authorAvatar?: string;
  date: Date;
  image?: string;
}