import { initializeApp, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth, OAuthProvider, GithubAuthProvider } from 'firebase/auth';

// Firebase configuration object
// Note: In Next.js, we must access process.env.NEXT_PUBLIC_* directly for the bundler to capture it.
// Dynamic access like process.env[key] will NOT work.

const requiredKeys = [
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
];

if (requiredKeys.some(key => !key)) {
  console.error('[Firebase] Missing one or more required environment variables.');
  console.error('Required: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, etc.');
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
if (projectId && projectId.endsWith('.')) {
  console.error('[Firebase] Invalid NEXT_PUBLIC_FIREBASE_PROJECT_ID: must not end with a dot. Fix your .env');
  throw new Error('Invalid NEXT_PUBLIC_FIREBASE_PROJECT_ID');
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} as const;

// Initialize Firebase with error handling
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let microsoftProvider: OAuthProvider;

try {
  // Check if required config values exist
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase configuration is incomplete. Please check your .env.local file.');
  }

  app = initializeApp(firebaseConfig);
  // Initialize Firestore with persistent cache
  // Initialize Firestore with persistent cache
  db = getFirestore(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  microsoftProvider = new OAuthProvider('microsoft.com');

  // Configure Google provider with recommended settings
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    access_type: 'offline',
  });

  // Note: Modern Firestore SDKs enable persistence by default in web environments where supported.
  // We can explicitly configure it if needed, but the default behavior is usually sufficient and safer.
  // Removing the deprecated enableIndexedDbPersistence call to avoid errors.

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  console.error('Please check your .env.local file and ensure all Firebase configuration values are correct.');
  throw error;
}

const githubProvider = new GithubAuthProvider();

// Export initialized instances
export { app, db, auth, googleProvider, microsoftProvider, githubProvider };
