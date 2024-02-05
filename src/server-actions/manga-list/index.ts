/* eslint-disable @typescript-eslint/naming-convention */
'use server';

import { DynamodbOrm } from '@lib/dynamodb/dynamodb-orm';
import { MangaEntity, TABLES, UsersMangaEntity, usersMangaEntity } from '@lib/dynamodb/entities';

export type Manga = {
  usersMangaId: UsersMangaEntity['id'];
  title: MangaEntity['title'];
  latestEpisodeUrl: MangaEntity['latestEpisodeUrl'];
  episodeNumber: MangaEntity['episodeNumber'];
  isAlreadyRead: UsersMangaEntity['isAlreadyRead'];
};

export type MangaList = Manga[];

export async function getMangaList(userId: UsersMangaEntity['userId']): Promise<MangaList> {
  try {
    const validatedUserId = usersMangaEntity.shape.userId.parse(userId);
    const dynamodb = DynamodbOrm.getInstance();

    // get usersMangaIds by userId
    const usersMangaIds = (await dynamodb.getItems({
      TableName               : TABLES['mainTable'],
      IndexName               : 'DataValueGSI',
      KeyConditionExpression  : '#dataValue = :dataValue',
      ExpressionAttributeNames: {
        '#dataValue': 'dataValue',
      },
      ExpressionAttributeValues: {
        ':dataValue': validatedUserId,
      },
      ProjectionExpression: 'id',
    })) as { id: string }[];

    if (usersMangaIds.length === 0) {
      return [];
    }

    // get mangaId and isAlreadyRead by usersMangaIds
    const usersMangaDataList = await Promise.all(
      usersMangaIds.map(async ({ id }) => {
        return Promise.all(
          (['UsersManga#mangaId', 'UsersManga#isAlreadyRead'] as const).map(async (dataType) => {
            const usersMangaData = await dynamodb.getItem({
              tableName: TABLES['mainTable'],
              id       : id,

              // TODO: #14 dataTypeがunion型になるとエラーになる。union型に対応する。putのときはdataTypeが決まるとdataValueも決まるようにする。inputによって返り値が決まるようにする
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dataType: dataType as any,
            });
            if (usersMangaData === undefined) {
              throw new Error('usersMangaData is undefined');
            }
            return usersMangaData;
          }),
        );
      }),
    );

    if (usersMangaDataList.length === 0) {
      throw new Error('usersMangaDataList is empty');
    }

    // get mangaIds by usersMangaDataList
    const mangaIds = usersMangaDataList.map((data) => {
      const filteredData = data.filter(({ dataType }) => dataType === 'UsersManga#mangaId');
      return filteredData[0].dataValue;
    });

    // get mangaDataList by mangaIds
    const mangaDataList = (await Promise.all(
      mangaIds.map(async (mangaId) => {
        const mangaData = await dynamodb.getItems({
          TableName               : TABLES['mainTable'],
          KeyConditionExpression  : '#id = :id',
          ExpressionAttributeNames: {
            '#id': 'id',
          },
          ExpressionAttributeValues: {
            ':id': mangaId,
          },
          ProjectionExpression: 'dataValue, dataType',
        });
        return mangaData;
      }),
    )) as { dataValue: string; dataType: string }[][];

    // create mangaList
    const mangaList = mangaDataList
      .map((mangaData, index) => {
        const usersMangaId = usersMangaIds[index].id;
        const title = mangaData.filter(({ dataType }) => dataType === 'Manga#title')[0].dataValue;
        const latestEpisodeUrl = mangaData.filter(
          ({ dataType }) => dataType === 'Manga#latestEpisodeUrl',
        )[0].dataValue;
        const episodeNumber = Number(
          mangaData.filter(({ dataType }) => dataType === 'Manga#episodeNumber')[0].dataValue,
        );
        const isAlreadyRead =
          usersMangaDataList[index].filter(
            ({ dataType }) => dataType === 'UsersManga#isAlreadyRead',
          )[0].dataValue === 'true';
        return {
          usersMangaId,
          title,
          latestEpisodeUrl,
          episodeNumber,
          isAlreadyRead,
        };
      })
      .sort((first, second) => {

        // order by unread, title
        const ASC = 1;
        const DESC = -1;
        if (first.isAlreadyRead === second.isAlreadyRead) {
          return first.title > second.title ? ASC : DESC;
        }
        return first.isAlreadyRead ? ASC : DESC;
      });

    return mangaList;
  } catch (error) {
    const arg = userId;
    console.error('index', 'getMangaList', arg, error);
    throw error;
  }
}
