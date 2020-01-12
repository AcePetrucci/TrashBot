import { Client } from "discord.js";

export const findEmoji = (client: Client) => (emojiName: string) => client.emojis.find(emoji => emoji.name === emojiName);