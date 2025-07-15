
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // auth object might be a dummy if firebase is not initialized.
    if (!auth.onAuthStateChanged) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const displayNameParts = firebaseUser.displayName?.split('|') ?? [firebaseUser.email, ''];
        const name = displayNameParts[0] || firebaseUser.email || '사용자';
        const avatarUrl = displayNameParts.length > 1 && displayNameParts[1] ? displayNameParts[1] : `https://i.pravatar.cc/150?u=${firebaseUser.uid}`;
        setUser({ name, avatarUrl });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
