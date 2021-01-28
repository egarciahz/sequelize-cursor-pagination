"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeCursor = exports.encodeCursor = void 0;
function encodeCursor(cursor) {
    return cursor ? Buffer.from(JSON.stringify(cursor)).toString('base64') : null;
}
exports.encodeCursor = encodeCursor;
function decodeCursor(cursor) {
    return cursor
        ? JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'))
        : null;
}
exports.decodeCursor = decodeCursor;
