import React, { createContext, useContext, useState, useEffect } from 'react';

const SpaceContext = createContext();

export function SpaceProvider({ children }) {
  // Mock data: until Supabase Auth is fully implemented, we simulate two users
  const currentUser = { id: 'user-1', name: 'Ghafur' };
  const partnerUser = { id: 'user-2', name: 'Mey' };

  const [isPartnerSpace, setIsPartnerSpace] = useState(false);
  const [activeUserId, setActiveUserId] = useState(currentUser.id);

  const toggleSpace = () => {
    setIsPartnerSpace((prev) => !prev);
  };

  useEffect(() => {
    setActiveUserId(isPartnerSpace ? partnerUser.id : currentUser.id);
  }, [isPartnerSpace]);

  return (
    <SpaceContext.Provider
      value={{
        currentUser,
        partnerUser,
        isPartnerSpace,
        activeUserId,
        toggleSpace,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
}

export function useSpace() {
  return useContext(SpaceContext);
}
