import { Model as OriginModel } from 'sequelize-typescript';
import { FindOptions, Connection } from './annotation';
export declare abstract class Model<T = any, T2 = any> extends OriginModel<T, T2> {
    constructor(...args: any[]);
    static paginate<M extends OriginModel>(this: new () => M, options?: FindOptions): Promise<Connection<M>>;
}
