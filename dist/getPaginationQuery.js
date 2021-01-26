"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
function getPaginationQuery(cursor, cursorOrderOperator, paginationField, primaryKeyField) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (paginationField !== primaryKeyField) {
        return _a = {},
            _a[sequelize_1.Op.or] = [
                (_b = {},
                    _b[paginationField] = (_c = {},
                        _c[cursorOrderOperator] = cursor[0],
                        _c),
                    _b),
                (_d = {},
                    _d[paginationField] = cursor[0],
                    _d[primaryKeyField] = (_e = {},
                        _e[cursorOrderOperator] = cursor[1],
                        _e),
                    _d),
            ],
            _a;
    }
    else {
        return _f = {},
            _f[paginationField] = (_g = {},
                _g[cursorOrderOperator] = cursor[0],
                _g),
            _f;
    }
}
exports.default = getPaginationQuery;
