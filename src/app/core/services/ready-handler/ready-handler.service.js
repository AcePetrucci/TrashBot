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
const channels_1 = require("../../../utils/keywords/channels");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const doujin_finder_service_1 = require("../doujin-finder/doujin-finder.service");
let ReadyHandler = class ReadyHandler {
    constructor(doujinFinderService) {
        this._currentInterval = new rxjs_1.BehaviorSubject(10000);
        this._lastTimer = 0;
        this._incrementMs = 16000000;
        this._dayMs = 1000 * 60 * 60 * 24;
        this._doujinFinderService = doujinFinderService;
    }
    /**
     * Main Handle Function
     */
    handleReady(client) {
        return this._currentInterval.pipe(operators_1.switchMap(timer => this._sendDoujin(timer, client)));
    }
    _sendDoujin(currentInterval, client) {
        return rxjs_1.interval(currentInterval).pipe(operators_1.switchMap(_ => this._prepareObservableChannel(client)), operators_1.map(channel => channel.send(this._doujinFinderService.findDoujin())), operators_1.tap(_ => this._dayTimer()));
    }
    /**
     * Ready Observable
     */
    _prepareObservableChannel(client) {
        return rxjs_1.defer(() => rxjs_1.from(this._findBotChannels(client)));
    }
    /**
     * Get Bots Channels
     */
    _findBotChannels(client) {
        return client.channels
            .findAll('type', 'text')
            .filter((ch) => channels_1.channels.includes(ch.name));
    }
    /**
     * Day Timer
     */
    _dayTimer(needToIncrement = 0) {
        const generatedTimer = Math.floor(Math.random() * this._dayMs + 1);
        return (generatedTimer + this._lastTimer + needToIncrement) > this._dayMs
            ? this._currentInterval.next(generatedTimer)
            : this._dayTimer(needToIncrement + this._incrementMs);
    }
};
ReadyHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DoujinFinderService)),
    __metadata("design:paramtypes", [doujin_finder_service_1.DoujinFinderService])
], ReadyHandler);
exports.ReadyHandler = ReadyHandler;
//# sourceMappingURL=ready-handler.service.js.map