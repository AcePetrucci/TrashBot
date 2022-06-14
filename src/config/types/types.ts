const TYPES = {
  TrashBot: Symbol('TrashBot'),
  Client: Symbol('Client'),
  Token: Symbol('Token'),

  DoujinUrl: Symbol('DoujinUrl'),
  QuoteAPIUrl: Symbol('QuoteAPIUrl'),

  MessageHandler: Symbol('MessageHandler'),
  ReadyHandler: Symbol('ReadyHandler'),

  DoujinFinderService: Symbol('DoujinFinderService'),
  DoujinSenderService: Symbol('DoujinSenderService'),

  NhCommandsService: Symbol('NhCommandsService'),
  QuoteCommandsService: Symbol('QuoteCommandsService'),
  AddQuoteCommandsService: Symbol('AddQuoteCommandsService'),
  DeleteQuoteCommandsService: Symbol('DeleteQuoteCommandsService'),
  CustomCommandsService: Symbol('CustomCommandsService'),
  MusicCommandsService: Symbol('MusicCommandsService'),
}

export default TYPES;