import { Connection } from 'graphql-relay';
import { Model as OriginModel } from 'sequelize-typescript';
import { FindOptions } from './annotation';

export default abstract class Model<T = any, T2 = any> extends OriginModel<T, T2> {
    static paginate<M extends OriginModel>(this: new () => M, options?: FindOptions): Promise<Connection<M>> {
        throw new Error('Method not implemented. Decorate this class with the Paginate decorator.');
    }
}
