"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const discord_js_1 = require("discord.js");
const types_1 = require("../typings/types");
const main_bot_1 = require("../../app/components/main/main.bot");
const message_handler_service_1 = require("../../app/core/services/message-handler/message-handler.service");
const ready_handler_service_1 = require("../../app/core/services/ready-handler/ready-handler.service");
const doujin_finder_service_1 = require("../../app/core/services/doujin-finder/doujin-finder.service");
const container = new inversify_1.Container();
container.bind(types_1.TYPES.TrashBot).to(main_bot_1.TrashBot).inSingletonScope();
container.bind(types_1.TYPES.MessageHandler).to(message_handler_service_1.MessageHandler).inSingletonScope();
container.bind(types_1.TYPES.ReadyHandler).to(ready_handler_service_1.ReadyHandler).inSingletonScope();
container.bind(types_1.TYPES.DoujinFinderService).to(doujin_finder_service_1.DoujinFinderService).inSingletonScope();
container.bind(types_1.TYPES.Client).toConstantValue(new discord_js_1.Client());
container.bind(types_1.TYPES.Token).toConstantValue(process.env.TOKEN);
exports.default = container;
//# sourceMappingURL=inversify.config.js.map