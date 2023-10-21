import {
  getFirestore,
  type Firestore,
  collection,
  getDocs,
  getDoc,
  type DocumentReference,
  setDoc,
  updateDoc,
  deleteDoc,
  type QueryDocumentSnapshot,
  query,
  where,
  type Query,
  type QuerySnapshot,
  doc
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { storage } from '../services/firebase'

interface DataDocument<T> {
  id: string
  data: T
}

type QueryFilter = [string, any, any]

export const createDocument = async <T>(collectionName: string, data: T) => {
  const db = getFirestore()
  const docRef: DocumentReference = doc(db, collectionName)
  try {
    await setDoc(docRef, data as Record<string, any>)
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

export const createOrUpdateDocument = async <T>(collectionName: string, docId: string, data: T) => {
  const db = getFirestore()
  const docRef: DocumentReference = doc(db, collectionName, docId)

  try {
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      await updateDoc(docRef, data as Record<string, any>)
    } else {
      const dataWithRole = { ...data, role: 'user' }
      await setDoc(docRef, dataWithRole as Record<string, any>)
    }
  } catch (error) {
    console.error('Error creating/updating document:', error)
    throw error
  }
}

export const listDocuments = async <T>(collectionName: string, filters: QueryFilter[] = []): Promise<Array<DataDocument<T>>> => {
  const db: Firestore = getFirestore()
  const collectionRef = collection(db, collectionName)
  let queryRef: Query = collectionRef

  for (const filter of filters) {
    queryRef = query(queryRef, where(filter[0], filter[1], filter[2]))
  }

  try {
    const querySnapshot: QuerySnapshot = await getDocs(queryRef)
    const documents: Array<DataDocument<T>> = []

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      documents.push({
        id: doc.id,
        data: doc.data() as T
      })
    })

    return documents
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}

export const deleteDocument = async (collectionName: string, docId: string) => {
  const db: Firestore = getFirestore()
  const docRef: DocumentReference = doc(db, collectionName, docId)
  try {
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      await deleteDoc(docRef)
      if (collectionName === 'users') {
        // todo: delete user from auth
      }
    }
  } catch (error) {
    console.error('Error eliminando documento y usuario:', error)
    throw error
  }
}

export const uploadFile = async (file: string, path: string) => {
  const storageRef = ref(storage, path)
  await uploadString(storageRef, file, 'data_url')
  const url = await getDownloadURL(storageRef)
  return url.toString()
}

export const getDocument = async (collectionName: string, docId: string) => {
  const db: Firestore = getFirestore()
  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('No such document!')
  }
}
