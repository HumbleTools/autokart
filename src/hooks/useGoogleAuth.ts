import { useEffect, useState, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { config } from "../firebase-config";

// Initialize Firebase app only once
const app = initializeApp(config);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function useGoogleAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, provider);
  }, []);

  const signOutGoogle = useCallback(async () => {
    await signOut(auth);
  }, []);

  return {
    signInWithGoogle,
    signOutGoogle,
    isAuthenticated: !!user,
    user,
    loading,
  };
}
