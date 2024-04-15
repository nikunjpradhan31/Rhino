import { initializeApp } from "firebase/app";
//import {getFirestore} from "firebase/firestore"
//import {getFirestore, collection, getDocs, addDoc, setDoc,doc,query,where,getDoc } from "firebase/firestore"
//import {getAuth} from 'firebase/auth'
//import { createUserWithEmailAndPassword,getAuth, signOut, signInWithEmailAndPassword,onAuthStateChanged, setPersistence} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDCFS2QFhhuXk5yrYloknJKcBTs0xcd4nc",
  authDomain: "rhino-84f91.firebaseapp.com",
  projectId: "rhino-84f91",
  storageBucket: "rhino-84f91.appspot.com",
  messagingSenderId: "33811917307",
  appId: "1:33811917307:web:32a6e44d4e56648bdac35e",
  measurementId: "G-WW2SQ3MQYQ"
};

const app = initializeApp(firebaseConfig);

export default app;