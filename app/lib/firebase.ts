// app/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB-ikPNkuaJWaho5p7xBK2SqarGLZUFh3E",
    authDomain: "mapcha-3f415.firebaseapp.com",
    projectId: "mapcha-3f415",
    storageBucket: "mapcha-3f415.firebasestorage.app",
    messagingSenderId: "923973481544",
    appId: "1:923973481544:web:ac13be21269ef7445e947d"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
