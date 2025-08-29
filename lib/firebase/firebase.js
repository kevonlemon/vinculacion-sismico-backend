import admin from "firebase-admin";

const storageBucketUrl = process.env.STORAGE_BUCKET;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: storageBucketUrl,
});

// bucket que usaremos en los métodos
const bucket = admin.storage().bucket();

export default bucket;
