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
  groups?: Group[]
}

interface User {
  id: string
  email: string
  displayName: string
  photoURL: string
  roles: string[]
  ministries: Ministries[]
  groups: Groups[]
}

interface Groups {
  id: string
  name: string
  description: string
  ministry: Ministries
  leaders: User[]
  members?: User[]
}

interface Advertisement {
  id: string
  title: string
  description: string
  content: string
  createdBy: User
  image: string
  imagePath: string
  startDate: Timestamp
  endDate: Timestamp
  type: string
}
export type { Setting, Ministries, Groups, User, DataDocument, Advertisement }
