import * as Relay from 'graphql-relay';
import { Op, FindOptions as OriginalFindOptions, Order } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { decodeCursor, encodeCursor } from './cursor';
import getPaginationQuery from './getPaginationQuery';

export type PaginatedModel<M> = {
  paginate(this: { new(): M }, options?: OriginalFindOptions): Promise<Relay.Connection<M>>;
}

export type PaginationConfig = {
  primaryKeyField?: string;
}

export type FindOptions = OriginalFindOptions & {
  paginationField?: string;
  before?: Relay.ConnectionCursor;
  after?: Relay.ConnectionCursor;
  desc?: boolean;
}

export function annotate<T extends ModelCtor>({ primaryKeyField }: Required<PaginationConfig>, target: T): T & PaginatedModel<any> {
  const paginate = (options: FindOptions) => {
    const {
      order: extraOrder,
      where = {},
      attributes = [],
      include = [],
      limit,
      before,
      after,
      desc = false,
      raw = false,
      paranoid = true,
      nest = false,
      mapToModel = false,
      subQuery,
      ...queryArgs
    } = options;
    const decodedBefore = !!before ? decodeCursor(before) : null;
    const decodedAfter = !!after ? decodeCursor(after) : null;
    const cursorOrderIsDesc = before ? !desc : desc;
    const cursorOrderOperator = cursorOrderIsDesc ? Op.lt : Op.gt;
    const paginationField: string = options.paginationField ? options.paginationField : primaryKeyField;
    const paginationFieldIsNonId = paginationField !== primaryKeyField;

    let paginationQuery;

    if (before) {
      paginationQuery = getPaginationQuery(
        decodedBefore,
        cursorOrderOperator,
        paginationField,
        primaryKeyField,
      );
    } else if (after) {
      paginationQuery = getPaginationQuery(
        decodedAfter,
        cursorOrderOperator,
        paginationField,
        primaryKeyField,
      );
    }

    const whereQuery = paginationQuery
      ? { [Op.and]: [paginationQuery, where] }
      : where;

    const order: any[] = [
      extraOrder ? [extraOrder] : [],
      cursorOrderIsDesc ? [paginationField, 'DESC'] : [paginationField],
      paginationFieldIsNonId ? [primaryKeyField] : [],
    ];

    return target.findAll<any>({
      where: whereQuery,
      include,
      ...(limit && { limit: limit + 1 }),
      order,
      ...(Array.isArray(attributes) && attributes.length
        ? { attributes }
        : {}),
      raw,
      paranoid,
      nest,
      mapToModel,
      ...(typeof subQuery === 'boolean' && { subQuery }),
      ...queryArgs,
    })
      .then(results => {
        const hasMore = results.length > limit!;

        if (hasMore) {
          results.pop();
        }

        if (before) {
          results.reverse();
        }

        const hasNext = !!before || hasMore;
        const hasPrevious = !!after || (!!before && hasMore);

        let beforeCursor: string | null = null;
        let afterCursor: string | null = null;

        if (results.length > 0) {
          beforeCursor = paginationFieldIsNonId
            ? encodeCursor([
              results[0][paginationField],
              results[0][primaryKeyField],
            ])
            : encodeCursor([results[0][paginationField]]);

          afterCursor = paginationFieldIsNonId
            ? encodeCursor([
              results[results.length - 1][paginationField],
              results[results.length - 1][primaryKeyField],
            ])
            : encodeCursor([results[results.length - 1][paginationField]]);
        }

        const edges = results.map((node) => ({
          node: node,
          cursor: paginationFieldIsNonId
            ? encodeCursor([
              node[paginationField],
              node[primaryKeyField],
            ])
            : encodeCursor([node[paginationField]]),
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

  return <T & PaginatedModel<any>>target;
};
