import { Model, ModelCtor } from 'sequelize-typescript';
import { PaginationConfig, annotate, PaginatedModel } from './annotation';

/**
 * @description 
 * Class decorator to extend the target model with paging method.
 * Unfortunately the TypeScript team has also said on several occasions that they will not extend the experimental decorator support until TC39 standardizes on decorator support.
 * Even though the decorator works, you won't see the type spread and it can be cumbersome.
 */
function Pagination<T extends ModelCtor<M>, M extends Model>(constructor: T): T & PaginatedModel<M>;
function Pagination<T extends ModelCtor<M>, M extends Model>(oprions: PaginationConfig): (constructor: T) => T & PaginatedModel<M>;
function Pagination(args: any) {
    if (typeof args === 'function') {
        return annotate({ primaryKeyField: 'id' }, args);
    } else {
        const options = args as PaginationConfig;
        return (t: any) => {
            return annotate(options, t);
        }
    }
}

function withPagination({ primaryKeyField = 'id' }: PaginationConfig) {
    return function <T extends ModelCtor<M>, M extends Model>(model: T) {
        return annotate({ primaryKeyField }, model);
    }
}

export {
    withPagination,
    Pagination,
};
