import { getApps, deleteApp, initializeApp, getApp } from "firebase/app";
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../dataServices/UserService";
import { config } from "../firebase-config";

export const useFirebase = () => {
    const [user, setUser] = useState<User>();
    const [roles, setRoles] = useState<string[]>();
    const [isListeningAuth, setIsListeningAuth] = useState<boolean>(false);
    const navigate = useNavigate();

    if (!getApps().length) {
        initializeApp(config);
    }

    const listenAuthState = () => {
        if (isListeningAuth) return;
        setIsListeningAuth(true);
        onAuthStateChanged(getAuth(), changedUser => {
            if (changedUser) {
                setUser(changedUser);
                console.log('User state changed to signed in !');
            } else {
                setUser(undefined);
            }
        });
    };

    useEffect(() => {
        if (isListeningAuth) return;
        getRedirectResult(getAuth())
            .then((result) => {
                if (result) {
                    setUser(result.user);
                    console.log('User signed in !');
                } else {
                    console.log('No user is signed in.');
                    listenAuthState();
                }
            })
    });

    useEffect(() => {
        if (user && !roles) {
            getUser(user.email as string)
                .then(dbUser => setRoles(dbUser.roles));
        }
    }, [user, roles]);

    const signIn = () => {
        signInWithRedirect(getAuth(), new GoogleAuthProvider())
            .catch((error) => {
                console.error(error);
            });
    };

    const signOut = () => {
        getAuth()
            .signOut()
            .then(() => {
                setUser(undefined);
                deleteApp(getApp());
                console.log('Destroyed app and user !');
            })
            .catch((error) => {
                console.error(error);
            });
        navigate('/');
    };

    const isFullyLoggedIn = () => !!user && !!roles;

    return { user, roles, signIn, signOut, isFullyLoggedIn};
};

