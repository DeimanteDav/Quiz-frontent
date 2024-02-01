import { createContext } from "react";

export const BasicContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    userId: null,
    setUserId: () => {},
    userData: null,
    setUserData: () => {}
})
