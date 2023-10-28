import {
  collection,
  getDocs,
  getDoc,
  type DocumentReference,
  updateDoc,
  deleteDoc,
  type QueryDocumentSnapshot,
  query,
  where,
  type Query,
  type QuerySnapshot,
  doc,
  addDoc
  , type DocumentData,
  setDoc
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { storage, db } from '../services/firebase'

type QueryFilter = [string, any, any]

export const createDocument = async <T>(collectionName: string, data: T) => {
  try {
    const documentRef = await addDoc(collection(db, collectionName), data as Record<string, any>)
    return documentRef
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

export const createDocumentWithID = async <T>(collectionName: string, docId: string, data: T) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, data as Record<string, any>)
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

export const updateDocument = async <T>(collectionName: string, docId: string, data: T) => {
  try {
    const docRef: DocumentReference = doc(db, collectionName, docId)
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      await updateDoc(docRef, data as Record<string, any>)
    } else {
      throw new Error('Document does not exist')
    }
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

export const createOrUpdateDocument = async <T>(collectionName: string, docId: string, data: T) => {
  const docRef: DocumentReference = doc(db, collectionName, docId)

  try {
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      await updateDoc(docRef, data as Record<string, any>)
    } else {
      await createDocument(collectionName, data as Record<string, any>)
    }
  } catch (error) {
    console.error('Error creating/updating document:', error)
    throw error
  }
}

export const getCollection = async (collectionName: string, filters: QueryFilter[] = []) => {
  const collectionRef = collection(db, collectionName)
  let queryRef: Query = collectionRef

  for (const filter of filters) {
    queryRef = query(queryRef, where(filter[0], filter[1], filter[2]))
  }

  try {
    const querySnapshot: QuerySnapshot = await getDocs(queryRef)
    const documents: any[] = []

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      documents.push({ id: doc.id, ...doc.data() })
    })

    return documents
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}

export const deleteDocument = async (collectionName: string, docId: string) => {
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

export const getDocument = async (
  collectionName: string,
  docId: string
): Promise<DocumentData | undefined> => {
  const docRef: DocumentReference = doc(db, collectionName, docId)

  try {
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log('No such document!')
      return undefined
    }
  } catch (error) {
    console.error('Error fetching document:', error)
    throw error
  }
}

export const getRef = (collectionName: string, docId: string) => {
  return doc(db, collectionName, docId)
}
