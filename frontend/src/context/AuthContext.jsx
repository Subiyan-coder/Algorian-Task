import {createContext, useContext, useState} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(()=>
    {
        const stored = localStorage.getItem('user');
        return stored? JSON.parse(stored) : null;
    });

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (err) {
        console.error(err);
    } finally {
        localStorage.removeItem('user');
        setUser(null);
    }
    };

    return <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);