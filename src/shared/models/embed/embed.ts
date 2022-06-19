import { EmbedFieldData } from "discord.js";

export type IEmbed = {
  text: string;
  author: string;
  authorAvatar: string;
  date: Date;
}

export type IEmbedHelp = {
  title: string;
  author: string;
  authorAvatar: string;
  fields: EmbedFieldData[];
}