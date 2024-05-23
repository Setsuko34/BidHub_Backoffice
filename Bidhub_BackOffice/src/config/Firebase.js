// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbFZqH-Z-1MaKs-69Z7s8CSAqzzH1Lri0",
  authDomain: "bidhub-56b3f.firebaseapp.com",
  projectId: "bidhub-56b3f",
  storageBucket: "bidhub-56b3f.appspot.com",
  messagingSenderId: "723867287404",
  appId: "1:723867287404:web:637e61a2ff079d18577d49",
  measurementId: "G-PPWNW7S0JZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, analytics, db, storage };
