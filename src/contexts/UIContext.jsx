import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const value = {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
