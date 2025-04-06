// contexts/SteamContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SteamAccount, isSteamLinked } from './SteamAuth';

const SteamContext = createContext<{
  account: SteamAccount | null;
  refresh: () => Promise<void>;
}>({
  account: null,
  refresh: async () => {},
});

export const SteamProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<SteamAccount | null>(null);

  const refresh = async () => {
    const acc = await isSteamLinked();
    setAccount(acc);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SteamContext.Provider value={{ account, refresh }}>
      {children}
    </SteamContext.Provider>
  );
};

export const useSteam = () => useContext(SteamContext);