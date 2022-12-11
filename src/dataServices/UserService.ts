import { getApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const USERS = 'users';

export interface DbUser {
    email: string;
    roles: string[];
}

export const getUser = async (email: string) => {
    const db = getFirestore(getApp());
    const userDoc = await getDoc(doc(db, `${USERS}/${email}`));
    return userDoc.data() as DbUser;
};

export const isAdmin = (roles?: string[]) => roles?.includes('admin');