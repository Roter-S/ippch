import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  type Auth,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential
} from 'firebase/auth'
import { createOrUpdateDocument } from '../utils/firestoreUtils'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string
}

const app: FirebaseApp = initializeApp(firebaseConfig)

const auth: Auth = getAuth(app)

export const login = async ({ email, password }: { email: string, password: string }): Promise<UserCredential> =>
  await signInWithEmailAndPassword(auth, email, password)

export const register = async ({ email, password }: { email: string, password: string }) => {
  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      roles: {}
    }
    await createOrUpdateDocument('users', user.id, user)
    return userCredential
  } catch (error) {
    console.log(error)
  }
}

export const logOut = async (): Promise<void> => { await signOut(auth) }

export { auth }

export const db = getFirestore(app)

export const storage = getStorage(app)
