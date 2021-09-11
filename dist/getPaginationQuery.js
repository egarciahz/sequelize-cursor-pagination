"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function getPaginationQuery(cursor, cursorOrderOperator, paginationField, primaryKeyField) {
    if (paginationField !== primaryKeyField) {
        return {
            [sequelize_1.Op.or]: [
                {
                    [paginationField]: {
                        [cursorOrderOperator]: cursor[0],
                    },
                },
                {
                    [paginationField]: cursor[0],
                    [primaryKeyField]: {
                        [cursorOrderOperator]: cursor[1],
                    },
                },
            ],
        };
    }
    else {
        return {
            [paginationField]: {
                [cursorOrderOperator]: cursor[0],
            },
        };
    }
}
exports.default = getPaginationQuery;
