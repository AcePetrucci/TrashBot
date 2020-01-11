"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMessage = (message) => {
    console.log('\n***************************************************');
    console.log(`Message: ${message.content}`);
    console.log(`Author: ${message.author.username}`);
    console.log('***************************************************');
};
//# sourceMappingURL=logger.js.map