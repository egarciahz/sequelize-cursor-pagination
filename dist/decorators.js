"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = exports.withPagination = void 0;
const annotation_1 = require("./annotation");
function Pagination(args) {
    if (typeof args === 'function') {
        return (0, annotation_1.annotate)({ primaryKeyField: 'id' }, args);
    }
    else {
        const options = Object.assign({ primaryKeyField: 'id' }, args);
        return (t) => {
            return (0, annotation_1.annotate)(options, t);
        };
    }
}
exports.Pagination = Pagination;
function withPagination({ primaryKeyField = 'id' }) {
    return function (model) {
        return (0, annotation_1.annotate)({ primaryKeyField }, model);
    };
}
exports.withPagination = withPagination;
