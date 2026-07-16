import {createContext, useContext, useState} from 'react';
import api from '../api/axios'

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(()=> {
        const stored = localStorage.getItem('user');
        return stored? JSON.parse(stored) : null;
    });

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const updateUser = (updatedData) => {
        setUser((prevUser) => {
            if (!prevUser) return prevUser;

            const updatedUser = {
                ...prevUser,
                ...updatedData
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));

            return updatedUser;
        });
    };
    
    const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (err) {
        console.error('Logout failed:',err);
    } finally {
        localStorage.removeItem('user');
        setUser(null);
    }
    };

return (
  <AuthContext.Provider value={{ user, login, logout, updateUser }}>
    {children}
  </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);