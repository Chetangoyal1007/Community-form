// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaNI-82hPlbOFH695y2ohqMFiJroFaOjA",
  authDomain: "communityform-ef33d.firebaseapp.com",
  projectId: "communityform-ef33d",
  storageBucket: "communityform-ef33d.firebasestorage.app",
  messagingSenderId: "537425934465",
  appId: "1:537425934465:web:ca7c27d136f1907051b580",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export {auth, provider};