'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    deleteUser,
} from 'firebase/auth';
import { doc, setDoc, deleteDoc, getDocs, collection, query, where, Timestamp } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase/config';

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const register = async (email: string, password: string, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        await updateProfile(user, { displayName });

        // Build user data object, only including photoURL if it exists
        const userData: {
            uid: string;
            email: string;
            displayName: string;
            photoURL?: string;
            isAdmin: boolean;
            createdAt: ReturnType<typeof Timestamp.fromDate>;
            updatedAt: ReturnType<typeof Timestamp.fromDate>;
        } = {
            uid: user.uid,
            email: user.email!,
            displayName,
            isAdmin: false, // New users are NOT admins by default
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
        };

        // Only add photoURL if it exists
        if (user.photoURL) {
            userData.photoURL = user.photoURL;
        }

        await setDoc(doc(db, 'users', user.uid), userData);
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const deleteAccount = async () => {
        if (!user) {
            throw new Error('No user is currently logged in');
        }

        try {
            const userId = user.uid;

            // 1. Delete all projects created by this user (if you track project ownership)
            // Note: Currently projects don't have an 'authorId' field, so this is for future implementation
            // const projectsQuery = query(collection(db, 'projects'), where('authorId', '==', userId));
            // const projectsSnapshot = await getDocs(projectsQuery);
            // for (const doc of projectsSnapshot.docs) {
            //     await deleteDoc(doc.ref);
            // }

            // 2. Delete all contact form submissions from this user (if you track user submissions)
            // This assumes contact forms have a 'userId' field
            try {
                const contactsQuery = query(collection(db, 'contacts'), where('userId', '==', userId));
                const contactsSnapshot = await getDocs(contactsQuery);
                for (const contactDoc of contactsSnapshot.docs) {
                    await deleteDoc(contactDoc.ref);
                }
            } catch (error) {
                console.error('Error deleting contact submissions:', error);
                // Continue even if this fails
            }

            // 3. Delete user's profile images from Storage (if any)
            try {
                const userStorageRef = ref(storage, `users/${userId}`);
                const userFiles = await listAll(userStorageRef);
                for (const fileRef of userFiles.items) {
                    await deleteObject(fileRef);
                }
            } catch (error) {
                console.error('Error deleting user storage files:', error);
                // Continue even if this fails
            }

            // 4. Delete user document from Firestore
            await deleteDoc(doc(db, 'users', userId));

            // 5. Finally, delete the Firebase Auth account
            await deleteUser(user);

            // User is now deleted and will be automatically logged out
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        deleteAccount,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}