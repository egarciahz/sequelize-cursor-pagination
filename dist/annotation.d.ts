import * as Relay from 'graphql-relay';
import { FindOptions as OriginalFindOptions } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
export declare type PaginatedModel<M> = {
    paginate(this: {
        new (): M;
    }, options?: OriginalFindOptions): Promise<Relay.Connection<M>>;
};
export declare type PaginationConfig = {
    primaryKeyField?: string;
};
export declare type FindOptions = OriginalFindOptions & {
    paginationField?: string;
    before?: Relay.ConnectionCursor;
    after?: Relay.ConnectionCursor;
    desc?: boolean;
};
export declare function annotate<T extends ModelCtor>({ primaryKeyField }: Required<PaginationConfig>, target: T): T & PaginatedModel<any>;
