// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaTdB0o-pJWyobydpnZgJRAR9p0IcTIsk",
  authDomain: "project-thotify.firebaseapp.com",
  projectId: "project-thotify",
  storageBucket: "project-thotify.appspot.com",
  messagingSenderId: "233689270497",
  appId: "1:233689270497:web:aa24f954cbe3efc59ecfa0",
  measurementId: "G-XZ5KM9YSLM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
