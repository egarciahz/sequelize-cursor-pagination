import { Op, WhereOptions, Order } from 'sequelize';

export const parseCursor = (cursor: string): string[] | null => {
  if (!cursor) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
  } catch (e) {
    return null;
  }
};

export const normalizePrimaryKeyField = (
  primaryKeyField: string | string[],
): string[] => {
  return Array.isArray(primaryKeyField) ? primaryKeyField : [primaryKeyField];
};

export const ensurePrimaryKeyFieldInOrder = (
  order: any,
  primaryKeyField: string[],
): Order => {
  const missingPrimaryKeyFields = primaryKeyField.filter(
    (pkField) => !order.find(([field]) => field === pkField),
  );

  return [...order, ...missingPrimaryKeyFields.map((field) => [field, 'ASC'])];
};

export const normalizeOrder = (
  order: Order | undefined,
  primaryKeyField: string | string[],
) => {
  const normalizedPrimaryKeyField = normalizePrimaryKeyField(primaryKeyField);

  let normalized: any = [];

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

  return ensurePrimaryKeyFieldInOrder(normalized, normalizedPrimaryKeyField);
};

export const reverseOrder = (order: any): Order => {
  return order.map(([field, direction]) => [
    field,
    direction.toLowerCase() === 'desc' ? 'ASC' : 'DESC',
  ]);
};

export const serializeCursor = (payload: any): string => {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const createCursor = (instance: any, order: any) => {
  const payload = order.map(([field]) => instance[field]);

  return serializeCursor(payload);
};

export const isValidCursor = (cursor, order): boolean => {
  return cursor.length === order.length;
};

export function recursivelyGetPaginationQuery(
  order,
  cursor: string[],
): WhereOptions {
  const currentOp = order[0][1].toLowerCase() === 'desc' ? Op.lt : Op.gt;

  if (order.length === 1) {
    return {
      [order[0][0]]: {
        [currentOp]: cursor[0],
      },
    };
  } else {
    return {
      [Op.or]: [
        {
          [order[0][0]]: {
            [currentOp]: cursor[0],
          },
        },
        {
          [order[0][0]]: cursor[0],
          ...recursivelyGetPaginationQuery(order.slice(1), cursor.slice(1)),
        },
      ],
    };
  }
}

export const getPaginationQuery = (
  order: any,
  cursor: string[],
): WhereOptions | null => {
  if (!isValidCursor(cursor, order)) {
    return null;
  }

  return recursivelyGetPaginationQuery(order, cursor);
};
