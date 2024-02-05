'use client';

import SwipeList from '@components/SwipeList';
import { getUserIdByEmail } from '@lib/dynamodb/access-patterns';
import { LocalStorageManager } from '@lib/localStorage/localStorage';
import { getMangaList, MangaList } from '@server-actions/manga-list';
import { randomUUID } from 'crypto';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home(): JSX.Element {
  const session = useSession();
  const [mangaList, setMangaList] = useState<MangaList>([]);

  useEffect(() => {
    (async () => {
      if (session.status === 'unauthenticated') {
        console.debug('session.status: ', session.status);

        // redirect to signIn page
        signIn();
        return <></>;
      } else if (session.status === 'authenticated') {
        console.debug('session.status:', session.status);
        console.debug('session.data.user:', session.data.user);
        if (!session.data.user?.email) {
          throw new Error('session.data.user?.email is undefined');
        }

        // get userId from user email
        let userId = await getUserIdByEmail(session.data.user.email);
        if (!userId) {
          userId = randomUUID();
        } else {
          setMangaList(await getMangaList(userId));
        }
        const storage = LocalStorageManager.getInstance();
        storage.setItem('userId', userId);
      }
    })();
  }, [session]);

  return (
    <main
      style={{
        display       : 'flex',
        justifyContent: 'center',
        height        : '70vh',
        margin        : '10vh',
      }}
    >
      <div>

        <h1 className="text-center m-5 tracking-tight font-bold">Manga Manager ͡° ͜ʖ ͡°</h1>
        {session.status === 'authenticated' && (
          <>
            <button onClick={() => signOut()}>Sign Out</button>
            <SwipeList mangaList={mangaList}/>
          </>
        )}
      </div>
    </main>
  );
}
