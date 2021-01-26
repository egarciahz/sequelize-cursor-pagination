"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotate = void 0;
const sequelize_1 = require("sequelize");
const cursor_1 = require("./cursor");
const getPaginationQuery_1 = require("./getPaginationQuery");
function annotate({ primaryKeyField }, target) {
    const paginate = (options) => {
        const { order: extraOrder, where = {}, attributes = [], include = [], limit, before, after, desc = false, raw = false, paranoid = true, nest = false, mapToModel = false, subQuery } = options, queryArgs = __rest(options, ["order", "where", "attributes", "include", "limit", "before", "after", "desc", "raw", "paranoid", "nest", "mapToModel", "subQuery"]);
        const decodedBefore = !!before ? cursor_1.decodeCursor(before) : null;
        const decodedAfter = !!after ? cursor_1.decodeCursor(after) : null;
        const cursorOrderIsDesc = before ? !desc : desc;
        const cursorOrderOperator = cursorOrderIsDesc ? sequelize_1.Op.lt : sequelize_1.Op.gt;
        const paginationField = options.paginationField ? options.paginationField : primaryKeyField;
        const paginationFieldIsNonId = paginationField !== primaryKeyField;
        let paginationQuery;
        if (before) {
            paginationQuery = getPaginationQuery_1.default(decodedBefore, cursorOrderOperator, paginationField, primaryKeyField);
        }
        else if (after) {
            paginationQuery = getPaginationQuery_1.default(decodedAfter, cursorOrderOperator, paginationField, primaryKeyField);
        }
        const whereQuery = paginationQuery
            ? { [sequelize_1.Op.and]: [paginationQuery, where] }
            : where;
        const order = [
            extraOrder ? [extraOrder] : [],
            cursorOrderIsDesc ? [paginationField, 'DESC'] : [paginationField],
            paginationFieldIsNonId ? [primaryKeyField] : [],
        ].reduce((s, n) => ([...s, ...n]), []);
        return target.findAll(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ where: whereQuery, include }, (limit && { limit: limit + 1 })), { order }), (Array.isArray(attributes) && attributes.length
            ? { attributes }
            : {})), { raw,
            paranoid,
            nest,
            mapToModel }), (typeof subQuery === 'boolean' && { subQuery })), queryArgs))
            .then(results => {
            const hasMore = results.length > limit;
            if (hasMore) {
                results.pop();
            }
            if (before) {
                results.reverse();
            }
            const hasNext = !!before || hasMore;
            const hasPrevious = !!after || (!!before && hasMore);
            let beforeCursor = null;
            let afterCursor = null;
            if (results.length > 0) {
                beforeCursor = paginationFieldIsNonId
                    ? cursor_1.encodeCursor([
                        results[0][paginationField],
                        results[0][primaryKeyField],
                    ])
                    : cursor_1.encodeCursor([results[0][paginationField]]);
                afterCursor = paginationFieldIsNonId
                    ? cursor_1.encodeCursor([
                        results[results.length - 1][paginationField],
                        results[results.length - 1][primaryKeyField],
                    ])
                    : cursor_1.encodeCursor([results[results.length - 1][paginationField]]);
            }
            const edges = results.map((node) => ({
                node: node,
                cursor: paginationFieldIsNonId
                    ? cursor_1.encodeCursor([
                        node[paginationField],
                        node[primaryKeyField],
                    ])
                    : cursor_1.encodeCursor([node[paginationField]]),
            }));
            return {
                edges,
                pageInfo: {
                    hasNextPage: hasNext,
                    hasPreviousPage: hasPrevious,
                    startCursor: beforeCursor,
                    endCursor: afterCursor,
                },
            };
        });
    };
    Object.assign(target, {
        paginate
    });
    return target;
}
exports.annotate = annotate;
;
