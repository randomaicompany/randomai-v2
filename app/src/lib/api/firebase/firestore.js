import { db } from "root/src/lib/firebase";
import {
  query,
  where,
  limit,
  addDoc,
  getDocs,
  orderBy,
  collection,
  serverTimestamp
} from "firebase/firestore";

export const addDocument = async (collectionName, data) => {
  const body = {
    ...data,
    createdDate: serverTimestamp()
  };

  await addDoc(collection(db, collectionName), body);
};

export const fetchDocumentsByUserId = async (collectionName, userId) => {
  const q = query(
    collection(db, collectionName),
    where("userId", "==", userId),
    orderBy("createdDate", "desc"),
    limit(25)
  );

  const querySnapshot = await getDocs(q);

  const documents = querySnapshot.docs.map((doc) => {
    if (!doc.exists()) return {};

    return {
      id: doc.id,
      ...doc.data()
    };
  });

  return documents;
};
