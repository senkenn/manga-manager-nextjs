import { DynamodbOrm } from '@lib/dynamodb/dynamodb-orm';
import { TABLES } from '@lib/dynamodb/entities';
import { loadEnvConfig } from '@next/env';
import fs from 'fs';

loadEnvConfig(process.cwd());

export const dynamodb = DynamodbOrm.getInstance();
const mainTableSchemaJson = fs
  .readFileSync('.devcontainer/localstack/init/schemas/mainTableSchema.json')
  .toString(); // convert Buffer to string

beforeEach(async () => {
  const mainTableSchema = {
    ...JSON.parse(mainTableSchemaJson),
    TableName: `table${process.env.VITEST_WORKER_ID}`,
  };
  TABLES['mainTable'] = mainTableSchema.TableName;
  await dynamodb.createTable(mainTableSchema);

  return async () => {
    await dynamodb.deleteTable(mainTableSchema.TableName);
  };
});
