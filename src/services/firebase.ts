import { initializeApp, FirebaseApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { createOrUpdateDocument } from "../utils/firestoreUtils";
import { getStorage } from "firebase/storage";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);

export const login = ({ email, password }: { email: string; password: string }): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);

export const register = async ({ email, password }: { email: string; password: string; }): Promise<UserCredential> => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createOrUpdateDocument('users', userCredential.user.uid, userCredential.user);
  return userCredential;
};

export const logOut = (): Promise<void> => signOut(auth);

export { auth };

export const storage = getStorage(app);
