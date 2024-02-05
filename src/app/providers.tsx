'use client';

import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';

type AppProviderProps = {
  children?: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps): JSX.Element {
  return <SessionProvider><RecoilRoot>{children}</RecoilRoot></SessionProvider>;
}
