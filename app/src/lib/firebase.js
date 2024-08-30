import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore";
//
import { connectAuthEmulator } from "firebase/auth";
import { connectStorageEmulator } from "firebase/storage";
import { connectFunctionsEmulator } from "firebase/functions";
import { connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1so8NDuI1ub1Utu13ABcoxkoww-2lrd4",
  authDomain: "even-ally-397218.firebaseapp.com",
  projectId: "even-ally-397218",
  storageBucket: "even-ally-397218.appspot.com",
  messagingSenderId: "580292304303",
  appId: "1:580292304303:web:23a253fffab3f3d54ae35a",
  measurementId: "G-2WQ19FXGMC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

if (!import.meta.env.PROD) {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectStorageEmulator(storage, "localhost", 9199);
  connectAuthEmulator(auth, "http://localhost:9099", {
    disableWarnings: true,
  });
}
