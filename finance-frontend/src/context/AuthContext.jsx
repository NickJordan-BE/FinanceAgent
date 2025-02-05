import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from './firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [curUser, setCurUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const user = onAuthStateChanged(auth, (user) => {
            setCurUser(user);
            setLoading(false);
        });

        return user;
    }, []);

    return (
        <AuthContext.Provider value={{ curUser }}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
};

export default AuthContext;