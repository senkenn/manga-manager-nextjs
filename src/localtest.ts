/* eslint-disable @typescript-eslint/no-unused-vars */
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamodbOrm } from '@lib/dynamodb/dynamodb-orm';
import { TABLES, usersMangaEntity } from '@lib/dynamodb/entities';
import { getMangaInfoFromEpisodesUrl } from '@lib/url-operator/url-operator';
import { deleteManga, putManga } from '@server-actions/manga-id';
import { ObjectKeys } from '@utils/type-maps/type-maps';
import axios from 'axios';
import fs from 'fs';

(async () => {
  process.env.AWS_PROFILE = 'localstack';
  process.env.AWS_ACCESS_KEY_ID = 'dummy';
  process.env.AWS_SECRET_ACCESS_KEY = 'dummy';
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_ENDPOINT = 'http://localstack-manga-manager:4566';
  process.env.DATABASE_URL = 'http://localstack-manga-manager:4566';

  const dynamodb = DynamodbOrm.getInstance();

  await deleteManga('a54af742-4cb3-4d82-9fc0-814592dc1fa1');

  const data = await dynamodb.getItems({
    TableName                : TABLES['mainTable'],
    KeyConditionExpression   : 'id = :id',
    ExpressionAttributeValues: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ':id': 'a54af742-4cb3-4d82-9fc0-814592dc1fa1',
    },
  });
  console.log(data);
})();
