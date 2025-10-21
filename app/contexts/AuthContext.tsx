'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User as AppUser } from '../types';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);

      if (user) {
        // Зберігаємо токен в cookies для middleware
        const token = await user.getIdToken();
        document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; secure; samesite=strict`;

        // Завантажуємо додаткові дані користувача з Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAppUser({
              uid: user.uid,
              email: user.email || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              createdAt: userData.createdAt?.toDate() || new Date(),
            });
          } else {
            // Створюємо новий документ користувача
            const newUser: AppUser = {
              uid: user.uid,
              email: user.email || '',
              firstName: user.displayName?.split(' ')[0] || '',
              lastName: user.displayName?.split(' ')[1] || '',
              createdAt: new Date(),
            };
            await setDoc(doc(db, 'users', user.uid), {
              ...newUser,
              createdAt: new Date(),
            });
            setAppUser(newUser);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // Видаляємо токен з cookies при logout
        document.cookie =
          'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setAppUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Створюємо документ користувача в Firestore
    const newUser: AppUser = {
      uid: user.uid,
      email: user.email || '',
      firstName,
      lastName,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...newUser,
      createdAt: new Date(),
    });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Перевіряємо чи існує документ користувача
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Створюємо новий документ користувача
      const newUser: AppUser = {
        uid: user.uid,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'users', user.uid), {
        ...newUser,
        createdAt: new Date(),
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    appUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
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
