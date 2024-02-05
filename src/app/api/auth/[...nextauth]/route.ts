import { getUserIdByEmail } from '@lib/dynamodb/access-patterns';
import { DynamodbOrm } from '@lib/dynamodb/dynamodb-orm';
import { TABLES } from '@lib/dynamodb/entities';
import { randomUUID } from 'crypto';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// This is the route that NextAuth uses to handle authentication requests.
const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId    : process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret   : process.env.NEXTAUTH_URL as string,
  callbacks: {
    signIn: async ({ user }) => {
      console.debug('signIn', user);
      if (!user.email) {
        console.error('user email is not found');
        return false;
      }

      // get user's email from dynamodb
      const email = await getUserIdByEmail(user.email);
      if (email) {
        console.log('user\'s email is already exist');
      } else {
        console.log('user\'s email is not exist');

        // add user's email to dynamodb
        await DynamodbOrm.getInstance().putItem({
          tableName: TABLES['mainTable'],
          id       : randomUUID(),
          dataType : 'Users#email',
          dataValue: user.email,
        });
        console.log('add user\'s email to dynamodb');
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
