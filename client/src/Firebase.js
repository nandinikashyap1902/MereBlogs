// Create a firebase.js file
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0AhBFLSkd59Sa3lSy-49TA8dBKK5UnsM",
  authDomain: "mereblogs-7970a.firebaseapp.com",
  projectId: "mereblogs-7970a",
  storageBucket: "mereblogs-7970a.firebasestorage.app",
  messagingSenderId: "1:280813825125:web:e19c224b623e7751782a8c",
  appId: "G-4G3HTMDJDY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();