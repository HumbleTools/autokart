import { getApps, deleteApp, initializeApp, getApp } from 'firebase/app';
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { config } from '../firebase-config';
import { getUser } from '../services/UserService';
import { basicCatchToast } from '../utils/ToasterUtils';

const isDevMode = process.env.NODE_ENV == 'development';

export const useFirebase = () => {
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPending, setIsPending] = useState(true);

    const processLogin = (userToProcess?: User | null) => {
        if (userToProcess) {
            getUser(userToProcess.email!)
                .then(dbUser => {
                    setRoles([...dbUser.roles])
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
        setRoles([]);
        setIsLoggedIn(false);
        setIsPending(false);
    };

    if (getApps().length === 0) {
        initializeApp(config);
    }

    useEffect(() => {
        const auth = getAuth();

        // Always listen for auth state changes (detect persisted sessions)
        const unsubscribe = onAuthStateChanged(auth, changedUser => {
            if (changedUser) {
                processLogin(changedUser);
            } else {
                processLogout();
            }
        });

        // If using redirect flow (prod), also handle the redirect result once
        if (!isDevMode) {
            getRedirectResult(auth)
                .then(result => {
                    if (result?.user) processLogin(result.user);
                })
                .catch(basicCatchToast);
        }

        const timeout = setTimeout(() => setIsPending(false), 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const signIn = () => {
        const auth = getAuth();
        setIsPending(true);
        if (isDevMode) {
            // Popup is mandatory for localhost
            signInWithPopup(auth, new GoogleAuthProvider())
                .then(result => {
                    if (result?.user) processLogin(result.user);
                })
                .catch(basicCatchToast);
        } else {
            signInWithRedirect(auth, new GoogleAuthProvider())
                .catch(basicCatchToast);
        }
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
        roles,
        signIn,
        signOut,
        isLoggedIn,
        isPending
    };
}
