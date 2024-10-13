import { createContext,useState } from 'react';
export const UserContext = createContext({})
export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState({})
    const [posts, setPosts] = useState([]);
    
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo,posts, setPosts}}>
            
            {children}
        </UserContext.Provider>
     
        )
}