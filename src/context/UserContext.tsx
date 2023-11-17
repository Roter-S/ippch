import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode
} from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth } from '../services/firebase'
import Loader from '../components/common/Loader'
import { getDocument } from '../utils/firestoreUtils'

interface User {
  id: string
  email: string | null
  photoURL: string | null
  roles: string[] | null
}

interface UserContextType {
  user: User | false
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserContextProviderProps {
  children: ReactNode
}

export default function UserContextProvider ({
  children
}: UserContextProviderProps) {
  const [user, setUser] = useState<User | false | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (firebaseUser) => {
        if (firebaseUser != null) {
          const user = await mapFirebaseUser(firebaseUser)
          setUser(user)
        } else {
          setUser(false)
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  if (user === null) return <Loader />

  const contextValue: UserContextType = {
    user: user as User | false
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}

// Helper function to map Firebase user to your user type
async function mapFirebaseUser (firebaseUser: FirebaseUser): Promise<User> {
  const userData = await getDocument('users', firebaseUser.uid)

  const roles = userData?.roles ?? []

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    roles
  }
}
