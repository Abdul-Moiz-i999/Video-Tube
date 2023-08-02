import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  // Put this in env file
  apiKey: "AIzaSyBdv3KrpVljcZfmYY8hOOCF3wDuhmRTy9A",
  authDomain: "clone-4b872.firebaseapp.com",
  projectId: "clone-4b872",
  storageBucket: "clone-4b872.appspot.com",
  messagingSenderId: "569670771666",
  appId: "1:569670771666:web:f08558ab2100fcfc1f1e0b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Gonna use them in sign in page
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
// Gonna use this when we uplaod image or video
export default app;
