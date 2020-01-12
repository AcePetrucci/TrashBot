"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const tags_1 = require("../../../utils/doujins/tags");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const axios_1 = require("axios");
let DoujinFinderService = class DoujinFinderService {
    constructor() {
        this._doujinURL = 'https://nhentai.net';
        this._max = 297270;
        this._min = 20;
    }
    findDoujin() {
        return this._doujinGenerator();
    }
    findTagPage() {
        return this._doujinTagPageGenerator();
    }
    findDoujinByTag(tag) {
        return this._doujinByTagGenerator(tag).pipe(operators_1.tap(console.log));
    }
    /**
     * Doujin Generator
     */
    _doujinGenerator() {
        return `${this._doujinURL}/g/${this._generateCode()}`;
    }
    _doujinTagPageGenerator() {
        return `${this._doujinURL}/tag/${this._generateTag()}`;
    }
    _doujinByTagGenerator(tag) {
        return this._doujinPageTag(tag).pipe(operators_1.map(id => `${this._doujinURL}/g/${id}`));
    }
    /**
     * Code Generator
     */
    _generateCode() {
        return Math.floor(Math.random() * (this._max - this._min + 1) + this._min);
    }
    /**
     * Tag Generator
     */
    _generateTag() {
        return tags_1.tags[Math.floor(Math.random() * tags_1.tags.length)];
    }
    /**
     * Tag Doujin Search
     */
    _doujinPageTag(tag) {
        return rxjs_1.defer(() => rxjs_1.from(axios_1.default.get(`https://nhentai.net/api/galleries/search?query=${tag}`))).pipe(operators_1.map(res => res.data.result[Math.floor(Math.random() * res.data.result.length)].id));
    }
};
DoujinFinderService = __decorate([
    inversify_1.injectable()
], DoujinFinderService);
exports.DoujinFinderService = DoujinFinderService;
//# sourceMappingURL=doujin-finder.service.js.map