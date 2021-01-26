"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = exports.withPagination = void 0;
var annotation_1 = require("./annotation");
function Pagination(args) {
    if (typeof args === 'function') {
        return annotation_1.annotate({ primaryKeyField: 'id' }, args);
    }
    else {
        var options_1 = args;
        return function (t) {
            return annotation_1.annotate(options_1, t);
        };
    }
}
exports.Pagination = Pagination;
function withPagination(_a) {
    var _b = _a.primaryKeyField, primaryKeyField = _b === void 0 ? 'id' : _b;
    return function (model) {
        return annotation_1.annotate({ primaryKeyField: primaryKeyField }, model);
    };
}
exports.withPagination = withPagination;
