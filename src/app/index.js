"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const inversify_config_1 = require("../config/container/inversify.config");
const types_1 = require("../config/typings/types");
const trashBot = inversify_config_1.default.get(types_1.TYPES.TrashBot);
trashBot.listen().then(() => console.log('Logged in!')).catch((error) => console.log('RIP', error));
//# sourceMappingURL=index.js.map