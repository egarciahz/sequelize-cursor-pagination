# Sequelize Relay Pagination

## Cursor-based pagination for specification of relay connections.

Sequelize model decorator which provides relay cursor based pagination queries. For more information on the original project see [Some motivation and background](https://dev-blog.apollodata.com/understanding-pagination-rest-graphql-and-relay-b10f835549e7).

## Install

> switch to branch 'relay-sequelize' and append this repository to your package.json dependencies.

## How to use?

Define a Sequelize model and decorate it with the `withPagination` decorator:

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

- **primaryKeyField**, The primary key field of the model. With composite primary key provide an array containing the keys, for example `['key1', 'key2']`. The default value is `'id'`.

> Important note: remember to extend your class to the Pager Model as seen in the example above.

Call the `paginate` method:

```typescript

await Counter.paginate({
  where: { key: value },
  limit: 10,
});

```

The `paginate` method returns a promise, which resolves an object with the following properties:

- **count**, the total numbers rows matching the query
- **edges**, the results of the query
  - **edges.$.node**, the payload item of the query
  - **edges.$.cursor**, an opaque string for the paging
- **pageInfo**, object containing the cursors' related data
  - **pageInfo.startCursor**, the first record in the result serialized
  - **pageInfo.endCursor**, the last record in the result serialized
  - **pageInfo.hasNextPage**, `true` or `false` depending on whether there are records after the `after` cursor
  - **pageInfo.hasPreviousPage**, `true` or `false` depending on whether there are records before the `before` cursor

The `paginate` method has the following options:

- `after`: The cursor that indicates _after_ which edge the next set of edges should be fetched
- `before`: The cursor that indicates _before_ which edge next set of edges should be fetched
- `limit`: The maximum number of edges returned

Other options passed to the `paginate` method will be directly passed to the model's `findAll` method.

**⚠️ NB:** The `order` option format only supports the `['field']` and `['field', 'DESC']` variations (field name and the optional order direction). For example, ordering by an associated model's field won't work.

## Examples

The examples use the `Counter` model defined above.

Fetch the first `20` edges ordered by the `id` field (the `primaryKeyField` field) in ascending order:

```typescript
const result = await Counter.paginate({
  limit: 20,
});
```

First, fetch the first `10` edges ordered by the `value` field in a descending order. Second, fetch the first `10` edges after the `endCursor`. Third, fetch the last `10` edges before `startCursor`:

```typescript
const firstResult = await Counter.paginate({
  order: [['value', 'DESC']],
  limit: 10,
});

const secondResult = await Counter.paginate({
  order: [['value', 'DESC']],
  limit: 10,
  after: firstResult.pageInfo.endCursor,
});

const thirdResult = await Counter.paginate({
  order: [['value', 'DESC']],
  limit: 10,
  before: secondResult.pageInfo.startCursor,
});
```

## WIP

- Tests
- Example App
