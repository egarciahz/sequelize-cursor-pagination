"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotate = void 0;
const sequelize_1 = require("sequelize");
const utils_1 = require("./utils");
function annotate({ primaryKeyField }, target) {
    const paginate = (_a) => __awaiter(this, void 0, void 0, function* () {
        var { order: orderOption, where, after, before, limit } = _a, queryArgs = __rest(_a, ["order", "where", "after", "before", "limit"]);
        let order = (0, utils_1.normalizeOrder)(orderOption, primaryKeyField);
        order = before ? (0, utils_1.reverseOrder)(order) : order;
        const cursor = after
            ? (0, utils_1.parseCursor)(after)
            : before
                ? (0, utils_1.parseCursor)(before)
                : null;
        const paginationQuery = cursor ? (0, utils_1.getPaginationQuery)(order, cursor) : null;
        const paginationWhere = paginationQuery
            ? { [sequelize_1.Op.and]: [paginationQuery, where] }
            : where;
        const paginationQueryOptions = Object.assign({ where: paginationWhere, limit,
            order }, queryArgs);
        const totalCountQueryOptions = Object.assign({ where }, queryArgs);
        const cursorCountQueryOptions = Object.assign({ where: paginationWhere }, queryArgs);
        const [instances, count, cursorCount] = yield Promise.all([
            target.findAll(paginationQueryOptions),
            target.count(totalCountQueryOptions),
            target.count(cursorCountQueryOptions),
        ]);
        if (before) {
            instances.reverse();
        }
        const remaining = cursorCount - instances.length;
        const hasNextPage = (!before && remaining > 0) ||
            (Boolean(before) && count - cursorCount > 0);
        const hasPreviousPage = (Boolean(before) && remaining > 0) ||
            (!before && count - cursorCount > 0);
        const edges = instances.map((node) => ({
            node,
            cursor: (0, utils_1.createCursor)(node, order),
        }));
        const pageInfo = {
            hasNextPage,
            hasPreviousPage,
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        };
        return {
            count,
            edges,
            pageInfo,
        };
    });
    Object.assign(target, {
        paginate,
    });
    return target;
}
exports.annotate = annotate;
