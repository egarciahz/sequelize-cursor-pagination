import { Op } from 'sequelize';
export default function getPaginationQuery(cursor: any, cursorOrderOperator: any, paginationField: any, primaryKeyField: any): {
    [Op.or]: {
        [x: number]: any;
    }[];
} | {
    [x: number]: {
        [x: number]: any;
    };
    [Op.or]?: undefined;
};
