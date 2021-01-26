
export function encodeCursor(cursor) {
    return cursor ? Buffer.from(JSON.stringify(cursor)).toString('base64') : null;
}

export function decodeCursor(cursor) {
    return cursor
        ? JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'))
        : null;
}