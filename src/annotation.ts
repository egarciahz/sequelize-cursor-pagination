import * as Relay from 'graphql-relay';
import { Op, FindOptions as OriginalFindOptions } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import {
  parseCursor,
  createCursor,
  normalizeOrder,
  getPaginationQuery,
  reverseOrder,
} from './utils';

export type PaginationConfig = {
  primaryKeyField?: string;
};

export type FindOptions = OriginalFindOptions & {
  before?: Relay.ConnectionCursor;
  after?: Relay.ConnectionCursor;
  desc?: boolean;
};

export interface Connection<M> extends Relay.Connection<M> {
  count: number;
}

export type PaginatedModel<M> = {
  paginate(this: { new (): M }, options?: FindOptions): Promise<Connection<M>>;
};

export function annotate<T extends ModelCtor>(
  { primaryKeyField }: Required<PaginationConfig>,
  target: T,
): T & PaginatedModel<any> {
  const paginate = async ({
    order: orderOption,
    where,
    after,
    before,
    limit,
    ...queryArgs
  }: FindOptions) => {
    let order = normalizeOrder(orderOption, primaryKeyField);

    order = before ? reverseOrder(order) : order;

    const cursor = after
      ? parseCursor(after)
      : before
      ? parseCursor(before)
      : null;

    const paginationQuery = cursor ? getPaginationQuery(order, cursor) : null;

    const paginationWhere = paginationQuery
      ? { [Op.and]: [paginationQuery, where] }
      : where;

    const paginationQueryOptions = {
      where: paginationWhere,
      limit,
      order,
      ...queryArgs,
    };

    const totalCountQueryOptions = {
      where,
      ...queryArgs,
    };

    const cursorCountQueryOptions = {
      where: paginationWhere,
      ...queryArgs,
    };

    const [instances, count, cursorCount] = await Promise.all([
      target.findAll(paginationQueryOptions),
      target.count(totalCountQueryOptions),
      target.count(cursorCountQueryOptions),
    ]);

    if (before) {
      instances.reverse();
    }

    const remaining = cursorCount - instances.length;

    const hasNextPage =
      (!before && remaining > 0) ||
      (Boolean(before) && count - cursorCount > 0);

    const hasPreviousPage =
      (Boolean(before) && remaining > 0) ||
      (!before && count - cursorCount > 0);

    const edges = instances.map((node) => ({
      node,
      cursor: createCursor(node, order),
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
  };

  Object.assign(target, {
    paginate,
  });

  return <T & PaginatedModel<any>>target;
}
