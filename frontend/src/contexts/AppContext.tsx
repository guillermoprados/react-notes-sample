import React, { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '../types/api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

interface AppContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    user: null,
  });

  const login = (accessToken: string, refreshToken: string, user: User) => {
    setAuthState({
      accessToken,
      refreshToken,
      user,
    });
  };

  const logout = () => {
    setAuthState({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  };

  const isAuthenticated = !!authState.accessToken && !!authState.user;

  const value: AppContextType = {
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    user: authState.user,
    isAuthenticated,

    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
