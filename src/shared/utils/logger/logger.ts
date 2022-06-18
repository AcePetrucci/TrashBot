import { Message } from 'discord.js';

export const logMessage = (message: Message) => {
  console.log('\n***************************************************');
  console.log(`Message: ${message.content}`);
  console.log(`Author: ${message.author.username}`);
  console.log('***************************************************');
}
