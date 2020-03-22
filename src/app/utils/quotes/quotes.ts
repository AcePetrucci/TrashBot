import { Message, Client, GuildMember, User, TextChannel } from "discord.js"


/**
 * Format Quote
 */

export const formatQuote = (quote: any, message?: Message, authorID?: string) => {
  const author = message ? message.guild.members.find(member => member.user.id === (quote.authorID || authorID)) : null;

  return author
    ? {
      quoteText: `${quote.indexNum ? `#${quote.indexNum}: "${quote.quote}"` : quote}`,
      author: author?.nickname ?? author?.user.username,
      authorAvatar: author?.user.avatarURL,
      date: new Date(quote.createdAt ?? new Date())
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

export const sendQuote = (quote: any, message: Message, client: Client, channel?: TextChannel) => {
  return (channel ?? message.channel).send({embed: {
    color: 0xec407a,
    author: {
      name: quote.author,
      icon_url: quote.authorAvatar ?? client.user.avatarURL
    },
    title: quote.quoteText.length > 256 ? '' : quote.quoteText,
    description: quote.quoteText.length < 256 ? '' : quote.quoteText,
    timestamp: quote.date
  }})
}
