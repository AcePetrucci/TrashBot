import { Message, Client } from "discord.js"


/**
 * Format Quote
 */

export const formatQuote = (quote: any, message?: Message) => {
  const author = message ? message.guild.members.find(member => member.id === quote.authorID) : null;

  return author
    ? {
      quoteText: `#${quote.indexNum}: "${quote.quote}"`,
      author: author?.nickname,
      authorAvatar: author?.user.avatarURL,
      date: new Date(quote.createdAt)
    }
    : {
      quoteText: quote,
      author: 'TrashBot',
      authorAvatar: null,
      date: new Date()
    }
}


/**
 * Send Quote
 */

export const sendQuote = (quote: any, message: Message, client: Client) => {
  return message.channel.send({embed: {
    color: 0xec407a,
    author: {
      name: quote.author,
      icon_url: quote.authorAvatar ?? client.user.avatarURL
    },
    title: quote.quoteText,
    timestamp: quote.date
  }})
}
