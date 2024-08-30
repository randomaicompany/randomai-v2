import firebaseAdmin from "firebase-admin";

const app = firebaseAdmin.initializeApp();

export const firestore = app.firestore();
