export type IQuote = {
  authorID: string;
  quote: string;
  indexNum: number;
  createdAt: Date;
  deleted?: boolean;
}

export type IQuoteAuthor = {
  authorName: string;
  authorAvatar: string;
}

export type IQuoteRatio = {
  allQuotes: IQuote[];
  userQuotes: IQuote[];
  userName: string;
}