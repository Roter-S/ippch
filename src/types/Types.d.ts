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
  id: string
  name: string | null
  description: string
  groups?: DocumentReference[] | Group[]
}

interface User {
  id?: string
  uid: string
  email: string
  displayName: string
  photoURL: string
  roles: string[]
  ministries: DocumentReference[] | Ministries[]
  groups: DocumentReference[] | Groups[]
}

interface Groups {
  id: string
  name: string
  description: string
  leaders: DocumentReference[] | User[]
  members?: DocumentReference[] | User[]
}

export type { Setting, Ministries, Groups, User, DataDocument }
