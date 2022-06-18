import { Message, Client, GuildMember, User, TextChannel, MessageEmbed } from "discord.js"


/**
 * Format Quote
 */

export const formatQuote = async (quote: any, message?: Message, authorID?: string) => {
  const author = message
    ? await message.guild.members.fetch(quote.authorID || authorID)
    : null;

  return author
    ? {
      quoteText: `${quote.indexNum ? `#${quote.indexNum}: "${quote.quote}"` : quote}`,
      author: author?.nickname ?? author?.user.username,
      authorAvatar: author?.user.avatarURL(),
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
  const embed = new MessageEmbed()
    .setColor(0xec407a)
    .setAuthor({
      name: quote.author,
      iconURL: quote.authorAvatar ?? client.user.avatarURL()
    })
    .setTitle(quote.quoteText.length > 256 ? '' : quote.quoteText)
    .setDescription(quote.quoteText.length < 256 ? '' : quote.quoteText)
    .setTimestamp(quote.date);

  return (channel ?? message.channel).send({
    embeds: [embed]
  })
}
