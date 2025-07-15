
'use client';

import React, { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, IS_FIREBASE_CONFIGURED } from '@/lib/firebase';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>> | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, setUser: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase가 설정되지 않았거나 auth 객체에 onAuthStateChanged가 없으면 로딩 종료
    if (!IS_FIREBASE_CONFIGURED || !auth || typeof auth.onAuthStateChanged !== 'function') {
        const mockUser = { name: '게스트 사용자', avatarUrl: 'https://i.pravatar.cc/150?u=guest' };
        setUser(mockUser);
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const displayNameParts = firebaseUser.displayName?.split('|') ?? [firebaseUser.email, ''];
        const name = displayNameParts[0] || firebaseUser.email || '사용자';
        const avatarUrl = firebaseUser.photoURL || (displayNameParts.length > 1 && displayNameParts[1] ? displayNameParts[1] : `https://i.pravatar.cc/150?u=${firebaseUser.uid}`);
        setUser({ name, avatarUrl });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
