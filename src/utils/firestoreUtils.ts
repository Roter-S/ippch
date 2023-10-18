import {
    getFirestore,
    Firestore,
    collection,
    getDocs,
    getDoc,
    DocumentReference,
    setDoc,
    updateDoc,
    deleteDoc,
    QueryDocumentSnapshot,
    query,
    where,
    Query,
    QuerySnapshot,
    doc
} from "firebase/firestore";

interface DataDocument<T> {
    id: string;
    data: T;
}

type QueryFilter = [string, any, any];


export const createOrUpdateDocument = async <T>(collectionName: string, docId: string, data: T) => {
    const db = getFirestore();
    const docRef: DocumentReference = doc(db, collectionName, docId);

    try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            await updateDoc(docRef, data as { [key: string]: any });
        } else {
            const dataWithRole = { ...data, role: 'user' };
            await setDoc(docRef, dataWithRole as { [key: string]: any });
        }
    } catch (error) {
        console.error("Error creating/updating document:", error);
        throw error;
    }
};


export const listDocuments = async <T>(collectionName: string, filters: QueryFilter[] = []): Promise<DataDocument<T>[]> => {
    const db: Firestore = getFirestore();
    const collectionRef = collection(db, collectionName);
    let queryRef: Query = collectionRef;

    for (const filter of filters) {
        queryRef = query(queryRef, where(filter[0], filter[1], filter[2]));
    }

    try {
        const querySnapshot: QuerySnapshot = await getDocs(queryRef);
        const documents: DataDocument<T>[] = [];

        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            documents.push({
                id: doc.id,
                data: doc.data() as T,
            });
        });

        return documents;
    } catch (error) {

        console.error("Error fetching documents:", error);
        throw error;
    }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
    const db: Firestore = getFirestore();
    const docRef: DocumentReference = doc(db, collectionName, docId);
    try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            await deleteDoc(docRef);
            if (collectionName === 'users') {
                //todo: delete user from auth
            }
        }
    } catch (error) {
        console.error("Error eliminando documento y usuario:", error);
        throw error;
    }
};
