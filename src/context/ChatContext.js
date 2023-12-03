// context/ChatContext.js

import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export function useMyContext() {
  return useContext(ChatContext);
}

export function ContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Retrieve the authentication state from local storage or default to false
    return JSON.parse(sessionStorage.getItem("isAuthenticated")) || false;
  });

  useEffect(() => {
    // Update local storage when the authentication state changes
    sessionStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);
  
  return (
    <ChatContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </ChatContext.Provider>
  );
}
