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
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const types_1 = require("../../../config/typings/types");
const logger_1 = require("../../utils/logger/logger");
// import { MessageHandler } from 'src/app/core/services/message-handler';
let TrashBot = class TrashBot {
    constructor(client, token) {
        this.client = client;
        this.token = token;
    }
    listen() {
        this.client.on('message', (message) => {
            logger_1.logMessage(message);
            if (message.author.bot) {
                return false;
            }
        });
        return this.client.login(this.token);
    }
};
TrashBot = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Client)),
    __param(1, inversify_1.inject(types_1.TYPES.Token)),
    __metadata("design:paramtypes", [discord_js_1.Client, String])
], TrashBot);
exports.TrashBot = TrashBot;
//# sourceMappingURL=main.bot.js.map