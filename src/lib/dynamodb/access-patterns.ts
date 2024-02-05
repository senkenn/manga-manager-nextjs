'use server';

import { DynamodbOrm } from './dynamodb-orm';
import { TABLES, UsersEntity } from './entities';

export async function getUserIdByEmail(
  email: UsersEntity['email'],
): Promise<UsersEntity['id'] | undefined> {
  const dynamodb = DynamodbOrm.getInstance();
  const data = await dynamodb.getItem({
    tableName: TABLES['mainTable'],
    indexName: 'DataValueGSI',
    dataValue: email,
    dataType : 'Users#email',
  });
  if (data === undefined) {
    return undefined;
  }
  return data.id;
}
