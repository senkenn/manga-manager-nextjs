import { dynamodb } from '@utils/test/setup';
import { randomUUID } from 'crypto';

import { getUserIdByEmail } from './access-patterns';
import { TABLES } from './entities';

describe('getUserIdByEmail', () => {
  test('Get userId by email', async () => {

    /* ------------------------------ Test preprocessing ------------------------------- */

    // put users email
    const email = 'user@example.com';
    const userId = randomUUID();
    await dynamodb.putItem({
      tableName: TABLES['mainTable'],
      id       : userId,
      dataType : 'Users#email',
      dataValue: email,
    });

    /* ------------------------ Execute the function under test ------------------------ */

    let result = undefined;
    try {
      result = await getUserIdByEmail(email);
    } catch (error) {
      result = error;
    }

    /* ------------------------------- Evaluation Items -------------------------------- */

    expect(result).toBe(userId);
  });
});
