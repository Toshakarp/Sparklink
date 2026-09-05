import { createContext, useContext, useState, type ReactNode } from 'react';
import type { IUserApi, IPlacesApi, IPairApi } from '@/shared/api/core';

export interface ApiContextValue {
  userApi: IUserApi | null;
  placesApi: IPlacesApi | null;
  pairApi: IPairApi | null;
  setApis: (apis: { userApi: IUserApi; placesApi: IPlacesApi; pairApi: IPairApi }) => void;
}

const ApiContext = createContext<ApiContextValue | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [apis, setApisState] = useState<{ userApi: IUserApi | null; placesApi: IPlacesApi | null; pairApi: IPairApi | null }>({
    userApi: null,
    placesApi: null,
    pairApi: null,
  });

  const setApis = (newApis: { userApi: IUserApi; placesApi: IPlacesApi; pairApi: IPairApi }) => {
    setApisState(newApis);
  };

  return (
    <ApiContext.Provider value={{ ...apis, setApis }}>
      {children}
    </ApiContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi must be used within ApiProvider');
  return context;
};
