'use client';

import { type Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect } from 'react';

interface SessionContext {
  session: Session;
}

const sessionContext = createContext<SessionContext | undefined>(undefined);

export const SessionContextProvider: React.FC<Layout & SessionContext> = ({ children, session }) => {
  return <sessionContext.Provider value={{ session }}>{children}</sessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(sessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context.session;
};
