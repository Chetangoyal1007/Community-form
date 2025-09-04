// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaNI-82hPlbOFH695y2ohqMFiJroFaOjA",
  authDomain: "community-forum-24d4b.firebaseapp.com",
  projectId: "communityform-ef33d",
  storageBucket: "community-forum-24d4b.appspot.com",
  messagingSenderId: "537425934465",
  appId: "1:296737507370:web:f0ef141368925ef3c49b53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export {auth, provider};