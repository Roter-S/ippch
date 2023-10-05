import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../services/firebase";
import Loader from "../components/Common/Loader";

interface User {
  uid: string;
  email: string | null;
  photoURL: string | null;
}

interface UserContextType {
  user: User | false;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export default function UserContextProvider({
  children,
}: UserContextProviderProps) {
  const [user, setUser] = useState<User | false | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (user === null) return <Loader />;

  const contextValue: UserContextType = {
    user: user as User | false,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

// Helper function to map Firebase user to your user type
function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    // ... other properties
  };
}
