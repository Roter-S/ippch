import { type DocumentReference } from 'firebase/firestore'

interface DataDocument<T> {
  id: string
  data: T
}

interface Setting {
  id: string
  image: string
  name: string
}

interface Ministries {
  name: string | null
  description: string
  groups?: DocumentReference[]
  leaders?: DocumentReference[]
}

interface Groups {
  id: string
  name: string | null
  description: string
  leaders: DocumentReference[]
  members?: DocumentReference[]
}

interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  roles: string[]
  ministries: DocumentReference[]
  groups: DocumentReference[]
}

export type { Setting, Ministries, Groups, User, DataDocument }
