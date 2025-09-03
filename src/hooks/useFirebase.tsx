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
const MIN_PENDING_TIME = 500;

export const useFirebase = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [loginState, setLoginState] = useState<string>(AuthStatuses.PENDING);

    const processUser = (userToProcess: User | null) => {
        if (userToProcess) {
            getUser(userToProcess!.email!)
                .then(dbUser => {
                    setUserRoles([...dbUser.roles])
                    setUser(userToProcess);
                })
                .catch(basicCatchToast)
                .finally(() => setTimeout(() => setLoginState(AuthStatuses.LOGGED_IN), MIN_PENDING_TIME));
        } else {
            setUser(null);
            setUserRoles([]);
            setTimeout(() => setLoginState(AuthStatuses.LOGGED_OUT), MIN_PENDING_TIME);
        }
    };

    if (getApps().length === 0) {
        initializeApp(config);
    }

    useEffect(() => {
        if (loginState === AuthStatuses.PENDING) {
            onAuthStateChanged(getAuth(), changedUser => {
                processUser(changedUser);
            });
            getRedirectResult(getAuth())
                .then(result => {
                    if (result && result.user) {
                        processUser(result.user);
                    }
                })
                .catch(basicCatchToast);
        }
    }, [loginState]);


    const signIn = () => {
        setLoginState(AuthStatuses.PENDING);
        const signInMethod = process.env.NODE_ENV == 'development' ?
            signInWithPopup : signInWithRedirect; // Popup is mandatory for localhost
        signInMethod(getAuth(), new GoogleAuthProvider())
            .catch(basicCatchToast);
    };


    const signOut = () => {
        setLoginState(AuthStatuses.PENDING);
        getAuth()
        .signOut()
        .then(() => {
            processUser(null);
            deleteApp(getApp()).catch(basicCatchToast);
        })
        .catch(basicCatchToast);
    };

    return {
        user,
        userRoles,
        signIn,
        signOut,
        isLoggingPending: loginState === AuthStatuses.PENDING,
        isLoggedIn: loginState === AuthStatuses.LOGGED_IN,
        isLoggedOut: loginState === AuthStatuses.LOGGED_OUT,
    };
}
