// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDGMU0TNRiy0zXncv0YweAZ9toanPB0vRQ",
  authDomain: "kanban-board-5f4c7.firebaseapp.com",
  projectId: "kanban-board-5f4c7",
  storageBucket: "kanban-board-5f4c7.appspot.com",
  messagingSenderId: "469976689589",
  appId: "1:469976689589:web:54467e83088ee79f2007fc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

export default app;

export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
export const firestore = getFirestore(app);
