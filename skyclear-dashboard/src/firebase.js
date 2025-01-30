import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCx0LsKtJGJ6_gtIC05z3mBIa0HMsY4Fv0",
  authDomain: "skyclear-925d0.firebaseapp.com",
  databaseURL: "https://skyclear-925d0-default-rtdb.firebaseio.com",
  projectId: "skyclear-925d0",
  storageBucket: "skyclear-925d0.firebasestorage.app",
  messagingSenderId: "461421283136",
  appId: "1:461421283136:web:1b4038b8a6e305b9dcdca5",
  //measurementId: "G-0QTGB6Y56Y"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
