import admin from "firebase-admin";
import path from "path";

const serviceAccount = require(path.join(__dirname, "../config/firebaseKey.json"));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const db = admin.firestore();
