import type { Table } from 'zapatos/schema';
import { init } from './fixtures/setup';
import { Equals } from './fixtures/testTypes';

describe('Generated types', () => {
  init();

  it(`generates a union type for the schema's tables`, () => {
    const tableTypeEqual: Equals<
      Table,
      'appleTransactions' | 'authors' | 'bankAccounts' | 'books' | 'doctors' | 'emailAuthentication' | 'employees' | 'shifts' | 'stores' | 'tags'
    > = true;

    expect(tableTypeEqual).toBe(true);
  });
});
