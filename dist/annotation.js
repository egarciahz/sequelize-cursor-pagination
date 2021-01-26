"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotate = void 0;
var sequelize_1 = require("sequelize");
var cursor_1 = require("./cursor");
var getPaginationQuery_1 = __importDefault(require("./getPaginationQuery"));
function annotate(_a, target) {
    var primaryKeyField = _a.primaryKeyField;
    var paginate = function (options) {
        var _a;
        var extraOrder = options.order, _b = options.where, where = _b === void 0 ? {} : _b, _c = options.attributes, attributes = _c === void 0 ? [] : _c, _d = options.include, include = _d === void 0 ? [] : _d, limit = options.limit, before = options.before, after = options.after, _e = options.desc, desc = _e === void 0 ? false : _e, _f = options.paginationField, paginationField = _f === void 0 ? primaryKeyField : _f, _g = options.raw, raw = _g === void 0 ? false : _g, _h = options.paranoid, paranoid = _h === void 0 ? true : _h, _j = options.nest, nest = _j === void 0 ? false : _j, _k = options.mapToModel, mapToModel = _k === void 0 ? false : _k, subQuery = options.subQuery, queryArgs = __rest(options, ["order", "where", "attributes", "include", "limit", "before", "after", "desc", "paginationField", "raw", "paranoid", "nest", "mapToModel", "subQuery"]);
        var decodedBefore = !!before ? cursor_1.decodeCursor(before) : null;
        var decodedAfter = !!after ? cursor_1.decodeCursor(after) : null;
        var cursorOrderIsDesc = before ? !desc : desc;
        var cursorOrderOperator = cursorOrderIsDesc ? sequelize_1.Op.lt : sequelize_1.Op.gt;
        var paginationFieldIsNonId = paginationField !== primaryKeyField;
        var paginationQuery;
        if (before) {
            paginationQuery = getPaginationQuery_1.default(decodedBefore, cursorOrderOperator, paginationField, primaryKeyField);
        }
        else if (after) {
            paginationQuery = getPaginationQuery_1.default(decodedAfter, cursorOrderOperator, paginationField, primaryKeyField);
        }
        var whereQuery = paginationQuery
            ? (_a = {}, _a[sequelize_1.Op.and] = [paginationQuery, where], _a) : where;
        var order = [].concat(extraOrder ? [extraOrder] : [], cursorOrderIsDesc ? [paginationField, 'DESC'] : [paginationField], paginationFieldIsNonId ? [primaryKeyField] : []);
        return target.findAll(__assign(__assign(__assign(__assign(__assign(__assign({ where: whereQuery, include: include }, (limit && { limit: limit + 1 })), { order: order }), (Array.isArray(attributes) && attributes.length
            ? { attributes: attributes }
            : {})), { raw: raw,
            paranoid: paranoid,
            nest: nest,
            mapToModel: mapToModel }), (typeof subQuery === 'boolean' && { subQuery: subQuery })), queryArgs))
            .then(function (results) {
            var hasMore = results.length > limit;
            if (hasMore) {
                results.pop();
            }
            if (before) {
                results.reverse();
            }
            var hasNext = !!before || hasMore;
            var hasPrevious = !!after || (!!before && hasMore);
            var beforeCursor = null;
            var afterCursor = null;
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
            var edges = results.map(function (node) { return ({
                node: node,
                cursor: paginationFieldIsNonId
                    ? cursor_1.encodeCursor([
                        node[paginationField],
                        node[primaryKeyField],
                    ])
                    : cursor_1.encodeCursor([node[paginationField]]),
            }); });
            return {
                edges: edges,
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
        paginate: paginate
    });
    return target;
}
exports.annotate = annotate;
;
