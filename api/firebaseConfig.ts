// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiyYQWfd8fJAtqOAMjIHdKnGlk3aQwvoI",
    authDomain: "reacnative-2025-3da61.firebaseapp.com",
    databaseURL: "https://reacnative-2025-3da61-default-rtdb.firebaseio.com",
    projectId: "reacnative-2025-3da61",
    storageBucket: "reacnative-2025-3da61.firebasestorage.app",
    messagingSenderId: "654058783309",
    appId: "1:654058783309:web:8afd63fd93e4a50fbad204"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
