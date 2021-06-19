import { Client } from "discord.js";

export const findEmoji = (client: Client) => (
  emojiName: string
) => client.emojis.cache.find(emoji => emoji.name === emojiName);