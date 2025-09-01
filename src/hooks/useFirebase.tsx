import { getApps, deleteApp, initializeApp, getApp } from 'firebase/app';
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getUser } from '../services/UserService';
import { config } from '../firebase-config';
import { basicCatchToast } from '../utils/ToasterUtils';

const AuthStatuses = {
    LOGGED_IN: 'LOGGED_IN',
    LOGGED_OUT: 'LOGGED_OUT',
    PENDING: 'PENDING'
};

export const useFirebase = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [authStatus, setAuthStatus] = useState<string>(AuthStatuses.PENDING);

    const processUser = (userToProcess: User | null) => {
        if (userToProcess) {
            getUser(userToProcess!.email!)
                .then(dbUser => {
                    setUserRoles([...dbUser.roles])
                    setUser(userToProcess);
                })
                .catch(basicCatchToast)
                .finally(() => setAuthStatus(AuthStatuses.LOGGED_IN));
        } else {
            setUser(null);
            setUserRoles([]);
            setAuthStatus(AuthStatuses.LOGGED_OUT);
        }
    };

    if (getApps().length === 0) {
        initializeApp(config);
    }

    useEffect(() => {
        if (authStatus === AuthStatuses.PENDING) {
            onAuthStateChanged(getAuth(), changedUser => processUser(changedUser!));
            getRedirectResult(getAuth())
                .then(result => {
                    if (result && result.user) {
                        processUser(result.user);
                    }
                })
                .catch(basicCatchToast);
        }
    }, [authStatus]);

    const signIn = () => {
        const signInMethod = process.env.NODE_ENV == 'development' ?
            signInWithPopup : signInWithRedirect; // Popup is mandatory for localhost
        signInMethod(getAuth(), new GoogleAuthProvider())
            .catch(basicCatchToast);
        setAuthStatus(AuthStatuses.PENDING);
    };

    const signOut = () => getAuth()
        .signOut()
        .then(() => {
            processUser(null);
            deleteApp(getApp()).catch(basicCatchToast);
        })
        .catch(basicCatchToast);

    return {
        user,
        userRoles,
        signIn,
        signOut,
        isAuthPending: authStatus === AuthStatuses.PENDING
    };
}
