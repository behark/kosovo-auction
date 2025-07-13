import React, { createContext, useContext } from 'react';

// Define a simple session context with a mock user
const SessionContext = createContext({
  data: {
    user: {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Demo User',
      role: 'user',
      company: 'Demo Company',
      verificationStatus: 'verified'
    }
  },
  status: 'authenticated',
  update: () => Promise.resolve()
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionContext.Provider 
      value={{
        data: {
          user: {
            id: 'mock-user-id',
            email: 'user@example.com',
            name: 'Demo User',
            role: 'user',
            company: 'Demo Company',
            verificationStatus: 'verified'
          }
        },
        status: 'authenticated',
        update: () => Promise.resolve()
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
