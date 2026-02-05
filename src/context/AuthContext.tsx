"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

import { UserProfile } from '../types/user';

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null; // Added UserProfile
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  isAdmin: false,
  signInWithGoogle: async () => { },
  signInWithGithub: async () => { },
  signInWithEmail: async () => { },
  signUpWithEmail: async () => { },
  resetPassword: async () => { },
  logout: async () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Timeout للتأكد من عدم البقاء في حالة التحميل للأبد
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - forcing load completion');
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Set cookie for ALL users on .tolzy.me domain
        try {
          const token = await firebaseUser.getIdToken();
          // cookie settings: 
          // domain=.tolzy.me -> allows sharing with main domain and other subdomains
          // path=/ -> accessible everywhere
          // max-age=2592000 -> 30 days
          // Secure -> only sent over HTTPS
          // SameSite=Lax -> allows sending cookie when navigating from external sites
          document.cookie = `tolzy_token=${token}; domain=.tolzy.me; path=/; max-age=2592000; Secure; SameSite=Lax`;
        } catch (e) {
          console.error("Error setting session cookie:", e);
        }

        try {
          // Fetch additional user data including plan
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await import('firebase/firestore').then(mod => mod.getDoc(userDocRef));

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: data.displayName || firebaseUser.displayName || '',
              photoURL: data.photoURL || firebaseUser.photoURL,
              plan: data.plan || 'free', // Default to free if not set
              role: data.role || 'user'
            });
          } else {
            // Initialize new user profile if it doesn't exist (fallback)
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL,
              plan: 'free',
              role: 'user'
            };
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          // Non-blocking error, set basic profile
          setUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL,
            plan: 'free',
            role: 'user'
          });
        }

        if (firebaseUser.email === 'mahmoud.m.moussa5310@gmail.com') {
          // Set as admin for mahmoud.m.moussa5310@gmail.com
          try {
            const adminDocRef = doc(db, 'admins', firebaseUser.uid);
            await setDoc(adminDocRef, {
              role: 'admin',
              email: firebaseUser.email,
              createdAt: new Date().toISOString()
            });
            setIsAdmin(true);
            // Set Security Cookie for Middleware - ALSO on .tolzy.me
            document.cookie = "tolzy_admin_session=mahmoud_secure_session; domain=.tolzy.me; path=/; max-age=86400; Secure; SameSite=Lax";
          } catch (error) {
            console.log('Admin role check passed (local). Firestore write skipped (permissions).');
            setIsAdmin(true); // Still set as admin locally
            document.cookie = "tolzy_admin_session=mahmoud_secure_session; domain=.tolzy.me; path=/; max-age=86400; Secure; SameSite=Lax";
          }
        } else {
          setIsAdmin(false);
          // Clear admin cookie if not admin
          document.cookie = "tolzy_admin_session=; domain=.tolzy.me; path=/; max-age=0; Secure; SameSite=Lax";
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
        // Clear all cookies on logout/no user
        document.cookie = "tolzy_token=; domain=.tolzy.me; path=/; max-age=0; Secure; SameSite=Lax";
        document.cookie = "tolzy_admin_session=; domain=.tolzy.me; path=/; max-age=0; Secure; SameSite=Lax";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);

      try {
        const userDocRef = doc(db, 'users', result.user.uid);
        await setDoc(userDocRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          lastLoginAt: new Date().toISOString(),
        }, { merge: true });

        const snap = await import('firebase/firestore').then(mod => mod.getDoc(userDocRef));
        if (!snap.data()?.plan) {
          await setDoc(userDocRef, { plan: 'free' }, { merge: true });
        }
      } catch (firestoreError) {
        console.warn('Could not save user data to Firestore:', firestoreError);
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('تم إلغاء تسجيل الدخول');
      } else if (error.code === 'auth/popup-blocked') {
        setError('تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول باستخدام جوجل');
      }
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);

      try {
        const userDocRef = doc(db, 'users', result.user.uid);
        await setDoc(userDocRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          lastLoginAt: new Date().toISOString(),
        }, { merge: true });

        const snap = await import('firebase/firestore').then(mod => mod.getDoc(userDocRef));
        if (!snap.data()?.plan) {
          await setDoc(userDocRef, { plan: 'free' }, { merge: true });
        }
      } catch (firestoreError) {
        console.warn('Could not save user data to Firestore:', firestoreError);
      }
    } catch (error: any) {
      console.error('Github sign in error:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        setError('يوجد حساب بالفعل بنفس البريد الإلكتروني ولكن تم إنشاؤه بطريقة تسجيل دخول مختلفة.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('تم إلغاء تسجيل الدخول');
      } else if (error.code === 'auth/popup-blocked') {
        setError('تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول باستخدام جيت هاب');
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Admin check is now handled centrally in onAuthStateChanged
    } catch (error: any) {
      console.error('Email sign in error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('لا يوجد حساب بهذا البريد الإلكتروني');
      } else if (error.code === 'auth/wrong-password') {
        setError('كلمة المرور غير صحيحة');
      } else if (error.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else if (error.code === 'auth/too-many-requests') {
        setError('تم تجاوز عدد المحاولات. يرجى المحاولة لاحقاً');
      } else if (error.code === 'auth/invalid-credential') {
        setError('بيانات الدخول غير صحيحة. هل قمت بإنشاء حساب؟');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول');
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      try {
        const userDocRef = doc(db, 'users', result.user.uid);
        const displayName = firstName && lastName ? `${firstName} ${lastName}` : email.split('@')[0];
        await setDoc(userDocRef, {
          email: email,
          firstName: firstName || '',
          lastName: lastName || '',
          displayName: displayName,
          createdAt: new Date().toISOString(),
          photoURL: null,
          role: 'user',
          plan: 'free'
        });
      } catch (firestoreError) {
        console.warn('Could not save user data to Firestore:', firestoreError);
      }
    } catch (error: any) {
      console.error('Email sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مستخدم بالفعل');
      } else if (error.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل');
      } else if (error.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('لا يوجد حساب بهذا البريد الإلكتروني');
      } else if (error.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صحيح');
      } else {
        setError('حدث خطأ أثناء إعادة تعيين كلمة المرور');
      }
      throw error;
    }
  };

  // Update logout to clear cookie
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      // Clear cookies with domain specificity
      document.cookie = "tolzy_token=; domain=.tolzy.me; path=/; max-age=0; Secure; SameSite=Lax";
      document.cookie = "tolzy_admin_session=; domain=.tolzy.me; path=/; max-age=0; Secure; SameSite=Lax";
    } catch (error) {
      console.error('Logout error:', error);
      setError('حدث خطأ أثناء تسجيل الخروج');
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    logout,
    isAdmin,
  };

  // Loading screen component
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Background gradient decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative flex flex-col items-center gap-8">
          {/* Main Spinner - Circular Arrow Design */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {/* Rotating circular arrow */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
              <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Circular arc with arrow */}
                <path
                  d="M 100 20 A 80 80 0 1 1 20 100"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-gray-800 dark:text-gray-200"
                />
                {/* Arrow head */}
                <path
                  d="M 15 95 L 20 100 L 25 95"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="text-gray-800 dark:text-gray-200"
                />
              </svg>
            </div>

            {/* Center - TOLZY Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-30 animate-pulse" />
                {/* Logo image */}
                <img
                  src="/image/tools/Logo.png"
                  alt="Tolzy Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 text-center animate-pulse">
              جاري التحميل...
            </p>

            {/* Animated dots */}
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
