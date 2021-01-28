import { Op } from 'sequelize';
export default function getPaginationQuery(cursor: any[], cursorOrderOperator: symbol, paginationField: string, primaryKeyField: string): {
    [Op.or]: {
        [x: string]: any;
    }[];
} | {
    [x: string]: {
        [x: string]: any;
    };
    [Op.or]?: undefined;
};
