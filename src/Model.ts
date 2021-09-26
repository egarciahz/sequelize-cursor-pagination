import { Model as OriginModel } from 'sequelize-typescript';
import { FindOptions, Connection } from './annotation';

export abstract class Model<T = any, T2 = any> extends OriginModel<T, T2> {
    constructor(...args: any[]){
        super(...args);
    }
    
    static paginate<M extends OriginModel>(this: new () => M, options?: FindOptions): Promise<Connection<M>> {
        throw new Error('Method not implemented. Decorate this class with the Paginate decorator.');
    }
}
