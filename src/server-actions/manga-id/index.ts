import { DynamodbOrm } from '@lib/dynamodb/dynamodb-orm';
import { MangaEntity, TABLES, UsersEntity, UsersMangaEntity } from '@lib/dynamodb/entities';
import { getMangaInfoFromEpisodesUrl } from '@lib/url-operator/url-operator';
import { err, ok, Result } from '@utils/type-maps/type-maps';
import { randomUUID } from 'crypto';

type ResultPutManga = Result<
  unknown,
  | {
      type: 'bad-url';
    }
  | {
      type: 'already-exists';
    }
>;

// put manga info and usersManga info
export async function putManga(
  episodesUrl: MangaEntity['episodesUrl'],
  userId: UsersEntity['id'],
): Promise<ResultPutManga> {
  const functionName = 'putManga';

  const { title, episodeNumber, latestEpisodeUrl, error } = await getMangaInfoFromEpisodesUrl(
    episodesUrl,
  );
  if (error) {
    return err(functionName, { type: 'bad-url' });
  }

  const dynamodb = DynamodbOrm.getInstance();

  // is manga already exists?
  const mangaTitleRecord = await dynamodb.getItem({
    tableName: TABLES['mainTable'],
    indexName: 'DataValueGSI',
    dataType : 'Manga#title',
    dataValue: title,
  });

  if (mangaTitleRecord) {

    // is usersManga already exists?
    const usersMangaRecord = await dynamodb.getItem({
      tableName: TABLES['mainTable'],
      indexName: 'DataValueGSI',
      dataType : 'UsersManga#mangaId',
      dataValue: mangaTitleRecord.id,
    });
    if (usersMangaRecord) {
      return err(functionName, { type: 'already-exists' });
    }
  }

  const mangaId = mangaTitleRecord?.id ?? randomUUID();
  const usersMangaId = randomUUID();

  const putItemsMangaEntity = mangaTitleRecord
    ? []
    : [
      dynamodb.putItem({
        tableName: TABLES['mainTable'],
        id       : mangaId,
        dataType : 'Manga#title',
        dataValue: title,
      }),
      dynamodb.putItem({
        tableName: TABLES['mainTable'],
        id       : mangaId,
        dataType : 'Manga#episodesUrl',
        dataValue: episodesUrl,
      }),
      dynamodb.putItem({
        tableName: TABLES['mainTable'],
        id       : mangaId,
        dataType : 'Manga#latestEpisodeUrl',
        dataValue: latestEpisodeUrl,
      }),
      dynamodb.putItem({
        tableName: TABLES['mainTable'],
        id       : mangaId,
        dataType : 'Manga#episodeNumber',
        dataValue: episodeNumber.toString(),
      }),
      dynamodb.putItem({
        tableName: TABLES['mainTable'],
        id       : mangaId,
        dataType : 'Manga#createdAt',
        dataValue: new Date().toISOString(),
      }),
    ];

  const putItemsUsersMangaEntity = [
    dynamodb.putItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#userId',
      dataValue: userId,
    }),
    dynamodb.putItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#mangaId',
      dataValue: mangaId,
    }),
    dynamodb.putItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#isAlreadyRead',
      dataValue: 'false',
    }),
    dynamodb.putItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#createdAt',
      dataValue: new Date().toISOString(),
    }),
  ];

  await Promise.all([...putItemsMangaEntity, ...putItemsUsersMangaEntity]);

  return ok(functionName);
}

// delete usersManga info
type ResultDeleteManga = Result<unknown, { type: unknown }>;
export async function deleteManga(
  usersMangaId: UsersMangaEntity['id'],
): Promise<ResultDeleteManga> {
  const functionName = 'deleteManga';

  const dynamodb = DynamodbOrm.getInstance();

  await Promise.all([
    dynamodb.deleteItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#userId',
    }),
    dynamodb.deleteItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#mangaId',
    }),
    dynamodb.deleteItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#isAlreadyRead',
    }),
    dynamodb.deleteItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#createdAt',
    }),
    dynamodb.deleteItem({
      tableName: TABLES['mainTable'],
      id       : usersMangaId,
      dataType : 'UsersManga#updatedAt',
    }),
  ]);
  return ok(functionName);
}
