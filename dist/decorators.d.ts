import { Model, ModelCtor } from 'sequelize-typescript';
import { PaginationConfig, PaginatedModel } from './annotation';
/**
 * @description
 * Class decorator to extend the target model with paging method.
 * Unfortunately the TypeScript team has also said on several occasions that they will not extend the experimental decorator support until TC39 standardizes on decorator support.
 * Even though the decorator works, you won't see the type spread and it can be cumbersome.
 */
declare function Pagination<T extends ModelCtor<M>, M extends Model>(constructor: T): T & PaginatedModel<M>;
declare function Pagination<T extends ModelCtor<M>, M extends Model>(oprions: PaginationConfig): (constructor: T) => T & PaginatedModel<M>;
declare function withPagination({ primaryKeyField }: PaginationConfig): <T extends ModelCtor<M>, M extends Model<any, any>>(model: T) => T & PaginatedModel<any>;
export { withPagination, Pagination, };
