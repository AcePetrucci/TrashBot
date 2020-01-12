"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
let DoujinFinderService = class DoujinFinderService {
    constructor() {
        this._max = 297270;
        this._min = 20;
    }
    findDoujin() {
        return this._doujinGenerator();
    }
    /**
     * Doujin Generator
     */
    _doujinGenerator() {
        return `https://nhentai.net/g/${this._generateCode()}/`;
    }
    /**
     * Code Generator
     */
    _generateCode() {
        return Math.floor(Math.random() * (this._max - this._min + 1) + this._min);
    }
};
DoujinFinderService = __decorate([
    inversify_1.injectable()
], DoujinFinderService);
exports.DoujinFinderService = DoujinFinderService;
//# sourceMappingURL=doujin-finder.service.js.map