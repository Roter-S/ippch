import { getFirestore, doc, setDoc } from "firebase/firestore";
import { User } from 'firebase/auth';

export const createUserInFirestore = async (user: User) => {
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);
    const userDocData = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: "user",
    };
    await setDoc(userDocRef, userDocData);
};
