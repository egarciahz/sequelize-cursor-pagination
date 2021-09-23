import * as Relay from 'graphql-relay';
import { FindOptions as OriginalFindOptions } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
export declare type PaginationConfig = {
    primaryKeyField?: string;
};
export declare type FindOptions = OriginalFindOptions & {
    before?: Relay.ConnectionCursor;
    after?: Relay.ConnectionCursor;
    desc?: boolean;
};
export interface Connection<M> extends Relay.Connection<M> {
    count: number;
}
export declare type PaginatedModel<M> = {
    paginate(this: {
        new (): M;
    }, options?: FindOptions): Promise<Connection<M>>;
};
export declare function annotate<T extends ModelCtor>({ primaryKeyField }: Required<PaginationConfig>, target: T): T & PaginatedModel<any>;
