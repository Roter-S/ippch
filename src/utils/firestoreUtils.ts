import { getFirestore, collection, getDocs, DocumentReference, Firestore, setDoc, doc } from "firebase/firestore";
import { User } from 'firebase/auth';

interface UserDocument {
    email: string;
    name: string | null;
    photoURL: string | null;
    role: string;
}

export const createUserInFirestore = async (user: User): Promise<void> => {
    const db: Firestore = getFirestore();
    const userDocRef: DocumentReference = doc(db, "users", user.uid);
    const userDocData: UserDocument = {
        email: user.email || "",
        name: user.displayName || null,
        photoURL: user.photoURL || null,
        role: "user",
    };

    try {
        await setDoc(userDocRef, userDocData);
    } catch (error) {
        console.error("Error creating user document:", error);
        throw error;
    }
};

export const listUsersInFirestore = async (): Promise<{ id: string; name: string | null; email: string; urlPhoto: string | null; role: string; }[]> => {
    const db: Firestore = getFirestore();
    const usersCollectionRef = collection(db, "users");

    try {
        const querySnapshot = await getDocs(usersCollectionRef);
        const users: { id: string; name: string | null; email: string; urlPhoto: string | null; role: string; }[] = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data() as UserDocument;
            users.push({
                id: doc.id,
                name: userData.name || null,
                email: userData.email,
                urlPhoto: userData.photoURL || null,
                role: userData.role,
            });
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};