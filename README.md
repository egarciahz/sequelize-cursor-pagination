# Sequelize Relay Pagination

## Cursor-based pagination for specification of relay connections.

Sequelize model decorator which provides relay cursor based pagination queries. For more information on the original project see [Some motivation and background](https://dev-blog.apollodata.com/understanding-pagination-rest-graphql-and-relay-b10f835549e7).

## Install

> switch to branch 'relay-sequelize' and append this repository to your package.json dependencies.

## How to use

Define a sequelize model:

```typescript
// ...
import { Pagination, Model } from 'sequelize-relay-pagination';
import { Table } from 'sequelize-typescript';

@Pagination({
  primaryKeyField: 'id',
})
@Table
class Counter extends Model {
  // ...
}
```

The `Pagination` decorator has the following options:

- **primaryKeyField**, the primary key field of the model. The default value is `id`.

> Important note: remember to extend your class to the Pager Model as seen in the example above.

Call the `paginate` method:

```typescript

await Counter.paginate({
  where: { value: { $gt: 2 } },
  limit: 10,
});

```

The `paginate` method returns an object with following properties:

- **edges**, the results of the query
  - **edges.$.node**, the payload item of the query
  - **edges.$.cursor**, an opaque string for the paging
- **pageInfo**, object containing the cursors' related data
  - **pageInfo.startCursor**, the first record in the result serialized
  - **pageInfo.endCursor**, the last record in the result serialized
  - **pageInfo.hasNextPage**, `true` or `false` depending on whether there are records after the `after` cursor
  - **pageInfo.hasPreviousPage**, `true` or `false` depending on whether there are records before the `before` cursor

The `paginate` method has the following options:

- **where**, the query applied to [findAll](http://docs.sequelizejs.com/manual/tutorial/models-usage.html#-findall-search-for-multiple-elements-in-the-database) call
- **attributes**, the query applied to [findAll](http://docs.sequelizejs.com/manual/tutorial/models-usage.html#-findall-search-for-multiple-elements-in-the-database) and select only some [attributes](http://docs.sequelizejs.com/manual/tutorial/querying.html#attributes)
- **include**, applied to `findAll` for [eager loading](http://docs.sequelizejs.com/manual/tutorial/models-usage.html#eager-loading)
- **limit**, limit the number of records returned
- **order**, Custom ordering attributes,
- **desc**, whether to sort in descending order. The default value is `false`.
- **before**, the before cursor
- **after**, the after cursor
- **paginationField**, the field to be used for the pagination. The default value is the `primaryKeyField` option value.
- **raw**, whether the query will return Sequelize Models or raw data. The default is `false`.
- **paranoid**, whether the query will return deleted models if the model is set to `paranoid: true`. The default is `true`.

Other options passed to the `paginate` method will be directly passed to the model's `findAll` method. Use them at your own risk.

## Run tests

tests is in progress!
