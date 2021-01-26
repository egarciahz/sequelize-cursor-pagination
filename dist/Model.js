"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
class Model extends sequelize_typescript_1.Model {
    constructor(...args) {
        super(...args);
    }
    static paginate(options) {
        throw new Error('Method not implemented. Decorate this class with the Paginate decorator.');
    }
}
exports.Model = Model;
