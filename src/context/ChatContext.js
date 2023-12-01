import { createContext, useContext, useState } from "react";

const ChatContext=createContext()

export function useMyContext(){//Hook for use context
    return useContext(ChatContext)
}

export function ContextProvider({children}){
    const [isAuthinticated,setIsAuthenticated]=useState(false);

    return(
        <ChatContext.Provider value={{isAuthinticated,setIsAuthenticated}}>
            {children}
        </ChatContext.Provider>
    )
}