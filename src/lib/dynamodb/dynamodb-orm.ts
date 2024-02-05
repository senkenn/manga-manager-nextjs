/* eslint-disable @typescript-eslint/naming-convention */
import {
  CreateTableCommand,
  CreateTableCommandInput,
  DeleteTableCommand,
  DynamoDB,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';

z.setErrorMap((_, ctx) => {
  return { message: `${ctx.defaultError}, data: ${ctx.data}` };
});

const mainTableNameAndIdSchema = z.object({
  tableName: z.string(),
  id       : z.string().uuid(),
});

// MangaEntity
const mangaTitleSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Manga#title'),
    dataValue: z.string(),
  }),
);
const mangaEpisodeUrlSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Manga#episodesUrl'),
    dataValue: z.string().url(),
  }),
);
const mangaLatestEpisodeUrlSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Manga#latestEpisodeUrl'),
    dataValue: z.string().url(),
  }),
);
const mangaEpisodeNumberSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Manga#episodeNumber'),
    dataValue: z.string().regex(/^\d+$/),
  }),
);
const mangaCreateAtSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Manga#createdAt'),
    dataValue: z.string().datetime(),
  }),
);
const mangaUpdateAtSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Manga#updatedAt'),
    dataValue: z.string().datetime(),
  }),
);

// UsersEntity
const userEmailSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Users#email'),
    dataValue: z.string().email(),
  }),
);
const userCreateAtSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Users#createdAt'),
    dataValue: z.string().datetime(),
  }),
);
const userUpdateAtSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('Users#updatedAt'),
    dataValue: z.string().datetime(),
  }),
);

// UsersMangaEntity
const usersMangaUserIdSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('UsersManga#userId'),
    dataValue: z.string().uuid(),
  }),
);
const usersMangaMangaIdSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('UsersManga#mangaId'),
    dataValue: z.string().uuid(),
  }),
);
const usersMangaIsAlreadyReadSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('UsersManga#isAlreadyRead'),
    dataValue: z.enum(['true', 'false']),
  }),
);
const usersMangaCreateAtSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('UsersManga#createdAt'),
    dataValue: z.string().datetime(),
  }),
);
const usersMangaUpdateAtSchema = mainTableNameAndIdSchema.merge(
  z.object({
    dataType : z.literal('UsersManga#updatedAt'),
    dataValue: z.string().datetime(),
  }),
);

const mainTableSchema = z.union([
  mangaTitleSchema,
  mangaEpisodeUrlSchema,
  mangaLatestEpisodeUrlSchema,
  mangaEpisodeNumberSchema,
  mangaCreateAtSchema,
  mangaUpdateAtSchema,
  userEmailSchema,
  userCreateAtSchema,
  userUpdateAtSchema,
  usersMangaUserIdSchema,
  usersMangaMangaIdSchema,
  usersMangaIsAlreadyReadSchema,
  usersMangaCreateAtSchema,
  usersMangaUpdateAtSchema,
]);
type MainTableSchema = z.infer<typeof mainTableSchema>;
const mainTableItemSchema = z.union([
  mangaTitleSchema.omit({ tableName: true }),
  mangaEpisodeUrlSchema.omit({ tableName: true }),
  mangaLatestEpisodeUrlSchema.omit({ tableName: true }),
  mangaEpisodeNumberSchema.omit({ tableName: true }),
  mangaCreateAtSchema.omit({ tableName: true }),
  mangaUpdateAtSchema.omit({ tableName: true }),
  userEmailSchema.omit({ tableName: true }),
  userCreateAtSchema.omit({ tableName: true }),
  userUpdateAtSchema.omit({ tableName: true }),
  usersMangaUserIdSchema.omit({ tableName: true }),
  usersMangaMangaIdSchema.omit({ tableName: true }),
  usersMangaIsAlreadyReadSchema.omit({ tableName: true }),
  usersMangaCreateAtSchema.omit({ tableName: true }),
  usersMangaUpdateAtSchema.omit({ tableName: true }),
]);
type MainTableItemSchema = z.infer<typeof mainTableItemSchema>;

const mainTableQuerySchema = z.union([
  mangaTitleSchema.omit({ dataValue: true }),
  mangaEpisodeUrlSchema.omit({ dataValue: true }),
  mangaLatestEpisodeUrlSchema.omit({ dataValue: true }),
  mangaEpisodeNumberSchema.omit({ dataValue: true }),
  mangaCreateAtSchema.omit({ dataValue: true }),
  mangaUpdateAtSchema.omit({ dataValue: true }),
  userEmailSchema.omit({ dataValue: true }),
  userCreateAtSchema.omit({ dataValue: true }),
  userUpdateAtSchema.omit({ dataValue: true }),
  usersMangaUserIdSchema.omit({ dataValue: true }),
  usersMangaMangaIdSchema.omit({ dataValue: true }),
  usersMangaIsAlreadyReadSchema.omit({ dataValue: true }),
  usersMangaCreateAtSchema.omit({ dataValue: true }),
  usersMangaUpdateAtSchema.omit({ dataValue: true }),
]);
type MainTableQuerySchema = z.infer<typeof mainTableQuerySchema>;

const dataValueGsiIndexNameSchema = z.object({
  tableName: z.string(),
  indexName: z.literal('DataValueGSI'),
});
const dataValueGsiSchema = z.union([
  mangaTitleSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  mangaEpisodeUrlSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  mangaLatestEpisodeUrlSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  mangaEpisodeNumberSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  mangaCreateAtSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  mangaUpdateAtSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  userEmailSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  userCreateAtSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  userUpdateAtSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  usersMangaUserIdSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  usersMangaMangaIdSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  usersMangaIsAlreadyReadSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  usersMangaCreateAtSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
  usersMangaUpdateAtSchema.omit({ id: true }).merge(dataValueGsiIndexNameSchema),
]);

type DataValueGsiSchema = z.infer<typeof dataValueGsiSchema>;
type OrmQueryInput = MainTableQuerySchema | DataValueGsiSchema;

export class DynamodbOrm extends DynamoDBDocument {
  constructor() {
    const client = new DynamoDB({
      credentials: {
        accessKeyId    : process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
      region  : process.env.AWS_REGION,
      endpoint: process.env.DATABASE_URL,
    });
    super(client);
    this.dynamodb = DynamoDBDocument.from(client);
  }

  private dynamodb: DynamoDBDocument;

  private static instance: DynamodbOrm;

  static getInstance(): DynamodbOrm {
    if (!DynamodbOrm.instance) {
      console.debug('AWS REGION       :', process.env.AWS_REGION);
      console.debug('AWS ACCESS KEY ID:', process.env.AWS_ACCESS_KEY_ID);
      console.debug('AWS ACCESS KEY   :', process.env.AWS_SECRET_ACCESS_KEY);
      console.debug('AWS DB ENDPOINT  :', process.env.DATABASE_URL);
      DynamodbOrm.instance = new DynamodbOrm();
    }
    return DynamodbOrm.instance;
  }

  async createTable(schema: CreateTableCommandInput): Promise<void> {
    try {
      await this.dynamodb.send(new CreateTableCommand(schema));
    } catch (error) {
      const arg = schema;
      console.error('dynamodb-orm', 'createTable', arg, error);
    }
  }

  async deleteTable(tableName: string): Promise<void> {
    try {
      await this.dynamodb.send(new DeleteTableCommand({ TableName: tableName }));
    } catch (error) {
      const arg = tableName;
      console.error('dynamodb-orm', 'deleteTable', arg, error);
    }
  }

  /**
   * Get an item.
   *
   * @description
   *
   * @param {OrmQueryInput} input - The input of the query.
   *
   * @returns {MainTableSchema | undefined}
   * - MainTableSchema: If the item exists
   * - undefined: If the item does not exist
   */
  async getItem(input: OrmQueryInput): Promise<MainTableItemSchema | undefined> {

    // TODO: #19 Change the return type based on the input.dataType

    try {

      // IndexNameがある場合はGSIを利用する
      if ('indexName' in input) {
        const result = dataValueGsiSchema.parse(input);
        const data = await DynamodbOrm.instance.query({
          TableName               : input.tableName,
          IndexName               : input.indexName,
          KeyConditionExpression  : '#dataValue = :dataValue and #dataType = :dataType',
          ExpressionAttributeNames: {
            '#dataValue': 'dataValue',
            '#dataType' : 'dataType',
          },
          ExpressionAttributeValues: {
            ':dataValue': result.dataValue,
            ':dataType' : result.dataType,
          },
        });
        if (data.Items === undefined) {
          throw new Error('There is no items property.');
        }
        if (data.Items.length === 0) {
          return undefined;
        }

        const item = mainTableItemSchema.parse(data.Items[0]);
        return item;
      }

      // IndexNameがない場合はMainTableを利用する
      else {
        const validatedInput = mainTableQuerySchema.parse(input);
        const { tableName, ...key } = validatedInput;
        const data = await DynamodbOrm.instance.get({
          TableName: tableName,
          Key      : key,
        });
        if (data.Item === undefined) {
          return undefined;
        }
        const item = mainTableItemSchema.parse(data.Item);
        return item;
      }
    } catch (error) {
      const arg = input;
      console.error('dynamodb-orm', 'getItem', arg, error);
      throw error;
    }
  }

  async getItems(input: QueryCommandInput): Promise<unknown> {
    try {
      const data = await this.dynamodb.query(input);
      if (!data.Items) {
        throw new Error('There is no items property.');
      }
      return data.Items as unknown;
    } catch (error) {
      console.error('getItems', 'DynamoDB Error', error);
    }
  }

  async putItem(input: MainTableSchema): Promise<void> {
    const { tableName, ...item } = mainTableSchema.parse(input);
    try {
      await this.dynamodb.put({
        TableName: tableName,
        Item     : item,
      });
    } catch (error) {
      const arg = input;
      console.error('dynamodb-orm', 'putItem', arg, error);
    }
  }

  async deleteItem(input: MainTableQuerySchema): Promise<void> {
    try {
      await this.dynamodb.delete({
        TableName: input.tableName,
        Key      : {
          id      : input.id,
          dataType: input.dataType,
        },
      });
    } catch (error) {
      const arg = input;
      console.error('dynamodb-orm', 'deleteItem', arg, error);
    }
  }
}
