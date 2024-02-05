import { dynamodb } from '@utils/test/setup';
import { randomUUID } from 'crypto';

import { TABLES } from './entities';

describe('dynamodb-orm', () => {
  describe('getItem', () => {
    test('getUserByUserId: Exist', async () => {

      /* ------------------------------ Test preprocessing ------------------------------- */

      const userId = randomUUID();
      const email = 'user1@example.com';
      const item = {
        id       : userId,
        dataType : 'Users#email',
        dataValue: email,
      } as const;
      await dynamodb.putItem({
        tableName: TABLES['mainTable'],
        ...item,
      });

      /* ------------------------ Execute the function under test ------------------------ */

      let result = undefined;
      try {
        result = await dynamodb.getItem({
          tableName: TABLES['mainTable'],
          id       : userId,
          dataType : 'Users#email',
        });
      } catch (error) {
        result = error;
      }

      /* ------------------------------- Evaluation Items -------------------------------- */

      const expected = item;
      expect(result).toStrictEqual(expected);
    });

    test('getUserByUserId: No exist', async () => {

      /* ------------------------------ Test preprocessing ------------------------------- */

      const userId = randomUUID();
      const noExistUserId = randomUUID();
      const email = 'user1@example.com';
      const item = {
        id       : userId,
        dataType : 'Users#email',
        dataValue: email,
      } as const;
      await dynamodb.putItem({
        tableName: TABLES['mainTable'],
        ...item,
      });

      /* ------------------------ Execute the function under test ------------------------ */

      let result = undefined;
      try {
        result = await dynamodb.getItem({
          tableName: TABLES['mainTable'],
          id       : noExistUserId,
          dataType : 'Users#email',
        });
      } catch (error) {
        result = error;
      }

      /* ------------------------------- Evaluation Items -------------------------------- */

      const expected = undefined;
      expect(result).toStrictEqual(expected);
    });

    test('getUserByEmail: Exist', async () => {

      /* ------------------------------ Test preprocessing ------------------------------- */

      const userId = randomUUID();
      const email = 'user1@example.com';
      const item = {
        id       : userId,
        dataType : 'Users#email',
        dataValue: email,
      } as const;
      await dynamodb.putItem({
        tableName: TABLES['mainTable'],
        ...item,
      });

      /* ------------------------ Execute the function under test ------------------------ */

      let result = undefined;
      try {
        result = await dynamodb.getItem({
          tableName: TABLES['mainTable'],
          indexName: 'DataValueGSI',
          dataValue: email,
          dataType : 'Users#email',
        });
      } catch (error) {
        result = error;
      }

      /* ------------------------------- Evaluation Items -------------------------------- */

      const expected = item;
      expect(result).toStrictEqual(expected);
    });

    test('getUserByEmail: No exist', async () => {

      /* ------------------------------ Test preprocessing ------------------------------- */

      const userId = randomUUID();
      const email = 'user1@example.com';
      const noExistUsersEmail = 'nonUser@example.com';
      const item = {
        id       : userId,
        dataType : 'Users#email',
        dataValue: email,
      } as const;
      await dynamodb.putItem({
        tableName: TABLES['mainTable'],
        ...item,
      });

      /* ------------------------ Execute the function under test ------------------------ */

      let result = undefined;
      try {
        result = await dynamodb.getItem({
          tableName: TABLES['mainTable'],
          indexName: 'DataValueGSI',
          dataValue: noExistUsersEmail,
          dataType : 'Users#email',
        });
      } catch (error) {
        result = error;
      }

      /* ------------------------------- Evaluation Items -------------------------------- */

      const expected = undefined;
      expect(result).toStrictEqual(expected);
    });
  });
});
