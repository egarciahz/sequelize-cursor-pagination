"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationQuery = exports.recursivelyGetPaginationQuery = exports.isValidCursor = exports.createCursor = exports.serializeCursor = exports.reverseOrder = exports.normalizeOrder = exports.ensurePrimaryKeyFieldInOrder = exports.normalizePrimaryKeyField = exports.parseCursor = void 0;
const sequelize_1 = require("sequelize");
const parseCursor = (cursor) => {
    if (!cursor) {
        return null;
    }
    try {
        return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
    }
    catch (e) {
        return null;
    }
};
exports.parseCursor = parseCursor;
const normalizePrimaryKeyField = (primaryKeyField) => {
    return Array.isArray(primaryKeyField) ? primaryKeyField : [primaryKeyField];
};
exports.normalizePrimaryKeyField = normalizePrimaryKeyField;
const ensurePrimaryKeyFieldInOrder = (order, primaryKeyField) => {
    const missingPrimaryKeyFields = primaryKeyField.filter((pkField) => !order.find(([field]) => field === pkField));
    return [...order, ...missingPrimaryKeyFields.map((field) => [field, 'ASC'])];
};
exports.ensurePrimaryKeyFieldInOrder = ensurePrimaryKeyFieldInOrder;
const normalizeOrder = (order, primaryKeyField) => {
    const normalizedPrimaryKeyField = (0, exports.normalizePrimaryKeyField)(primaryKeyField);
    let normalized = [];
    if (Array.isArray(order)) {
        normalized = order.map((o) => {
            if (typeof o === 'string') {
                return [o, 'ASC'];
            }
            if (Array.isArray(o)) {
                const [field, direction] = o;
                return [field, direction || 'ASC'];
            }
            return o;
        });
    }
    return (0, exports.ensurePrimaryKeyFieldInOrder)(normalized, normalizedPrimaryKeyField);
};
exports.normalizeOrder = normalizeOrder;
const reverseOrder = (order) => {
    return order.map(([field, direction]) => [
        field,
        direction.toLowerCase() === 'desc' ? 'ASC' : 'DESC',
    ]);
};
exports.reverseOrder = reverseOrder;
const serializeCursor = (payload) => {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
};
exports.serializeCursor = serializeCursor;
const createCursor = (instance, order) => {
    const payload = order.map(([field]) => instance[field]);
    return (0, exports.serializeCursor)(payload);
};
exports.createCursor = createCursor;
const isValidCursor = (cursor, order) => {
    return cursor.length === order.length;
};
exports.isValidCursor = isValidCursor;
function recursivelyGetPaginationQuery(order, cursor) {
    const currentOp = order[0][1].toLowerCase() === 'desc' ? sequelize_1.Op.lt : sequelize_1.Op.gt;
    if (order.length === 1) {
        return {
            [order[0][0]]: {
                [currentOp]: cursor[0],
            },
        };
    }
    else {
        return {
            [sequelize_1.Op.or]: [
                {
                    [order[0][0]]: {
                        [currentOp]: cursor[0],
                    },
                },
                Object.assign({ [order[0][0]]: cursor[0] }, recursivelyGetPaginationQuery(order.slice(1), cursor.slice(1))),
            ],
        };
    }
}
exports.recursivelyGetPaginationQuery = recursivelyGetPaginationQuery;
const getPaginationQuery = (order, cursor) => {
    if (!(0, exports.isValidCursor)(cursor, order)) {
        return null;
    }
    return recursivelyGetPaginationQuery(order, cursor);
};
exports.getPaginationQuery = getPaginationQuery;
