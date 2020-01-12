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
const operators_1 = require("rxjs/operators");
let MessageHandler = class MessageHandler {
    constructor(doujinFinderService) {
        this._doujinFinderService = doujinFinderService;
    }
    handleMessage(message, client) {
        if (message.content.toLowerCase().includes('!trash')) {
            switch (true) {
                case message.content === '!trash':
                    const pepeS = client.emojis.find(emoji => emoji.name === 'PepeS');
                    return rxjs_1.defer(() => rxjs_1.from(message.reply(`Help will come, someday, sometime ${pepeS}`)));
                case message.content.includes('!trash scream'):
                    const lordsD = client.emojis.find(emoji => emoji.name === 'lordsD');
                    const speaker = '\:loudspeaker:';
                    const msgToScream = message.content.slice(14);
                    return rxjs_1.defer(() => rxjs_1.from(message.channel.send(`${lordsD} ${speaker}  ${msgToScream.toUpperCase()}`)));
                default:
                    const smugNep = client.emojis.find(emoji => emoji.name === 'SmugNep');
                    return rxjs_1.defer(() => rxjs_1.from(message.reply(`${smugNep} I can't do this shit (yet) ${smugNep}`)));
            }
        }
        if (message.content.toLowerCase().includes('!nh')) {
            switch (true) {
                case message.content.toLowerCase() === '!nh':
                    const pepeS = client.emojis.find(emoji => emoji.name === 'PepeS');
                    return rxjs_1.defer(() => rxjs_1.from(message.reply(`Help will come, someday, sometime ${pepeS}`)));
                case message.content.toLowerCase().includes('tag'):
                    return rxjs_1.defer(() => rxjs_1.from(message.channel.send(this._doujinFinderService.findTagPage())));
                default:
                    const tag = message.content.slice(4).toLowerCase();
                    const ayaya = client.emojis.find(emoji => emoji.name === 'AYAYA');
                    return rxjs_1.defer(() => this._doujinFinderService.findDoujinByTag(tag).pipe(operators_1.switchMap(doujin => message.channel.send(doujin)), operators_1.catchError(err => message.channel.send(`${ayaya} It seems your tag search doesn't exist ${ayaya}`))));
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