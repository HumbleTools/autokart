import { getApps, deleteApp, initializeApp, getApp } from 'firebase/app';
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getUser } from '../services/UserService';
import { config } from '../firebase-config';
import { basicCatchToast } from '../utils/ToasterUtils';

const isDevMode = process.env.NODE_ENV == 'development';
const signInMethod = isDevMode ? signInWithPopup : signInWithRedirect; // Popup is mandatory for localhost

export const useFirebase = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPending, setIsPending] = useState(true);

    const processLogin = (userToProcess?: User | null) => {
        if (userToProcess) {
            getUser(userToProcess.email!)
                .then(dbUser => {
                    setUserRoles([...dbUser.roles])
                    setUser(userToProcess);
                })
                .catch(basicCatchToast)
                .finally(() => {
                    setIsLoggedIn(true);
                    setIsPending(false);
                });
        }
    };
    const processLogout = () => {
        setUser(null);
        setUserRoles([]);
        setIsLoggedIn(false);
        setIsPending(false);
    };

    if (getApps().length === 0) {
        initializeApp(config);
    }

    useEffect(() => {
        if (!user) {
            if (isDevMode) {
                onAuthStateChanged(getAuth(), changedUser => {
                    processLogin(changedUser);
                });
            } else {
                getRedirectResult(getAuth())
                    .then(result => processLogin(result?.user))
                    .catch(basicCatchToast);
            }
        }
        setTimeout(() => setIsPending(false), 3000);
    }, [isLoggedIn]);

    const signIn = () => {
        signInMethod(getAuth(), new GoogleAuthProvider())
            .catch(basicCatchToast);
        setIsPending(true);
    }

    const signOut = () => getAuth()
        .signOut()
        .then(() => {
            processLogout();
            deleteApp(getApp()).catch(basicCatchToast);
        })
        .catch(basicCatchToast);

    return {
        user,
        userRoles,
        signIn,
        signOut,
        isLoggedIn,
        isPending
    };
}
