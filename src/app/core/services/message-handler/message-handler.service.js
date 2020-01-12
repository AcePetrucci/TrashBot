"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("../../../../config/typings/types");
const rxjs_1 = require("rxjs");
const doujin_finder_service_1 = require("../doujin-finder/doujin-finder.service");
let MessageHandler = class MessageHandler {
    constructor(doujinFinderService) {
        this._doujinFinderService = doujinFinderService;
    }
    handleMessage(message, client) {
        if (message.content.toLowerCase().includes('!trash')) {
            switch (true) {
                case message.content.toLowerCase().includes('tag'):
                    return rxjs_1.defer(() => rxjs_1.from(message.channel.send(this._doujinFinderService.findTagPage())));
                case message.content === '!trash':
                    const pepeS = client.emojis.find(emoji => emoji.name === 'PepeS');
                    return rxjs_1.defer(() => rxjs_1.from(message.reply(`Help will come, someday, sometime ${pepeS}`)));
                default:
                    const smugNep = client.emojis.find(emoji => emoji.name === 'SmugNep');
                    return rxjs_1.defer(() => rxjs_1.from(message.reply(`${smugNep} I can't do this shit (yet) ${smugNep}`)));
            }
        }
        return rxjs_1.defer(() => rxjs_1.from(Promise.reject()));
    }
};
MessageHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DoujinFinderService)),
    __metadata("design:paramtypes", [doujin_finder_service_1.DoujinFinderService])
], MessageHandler);
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=message-handler.service.js.map