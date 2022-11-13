
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBAKHvfxNa3M6P0cakl7Ml_9D8Wgd8beJM",
  authDomain: "house-marketplace-8b799.firebaseapp.com",
  projectId: "house-marketplace-8b799",
  storageBucket: "house-marketplace-8b799.appspot.com",
  messagingSenderId: "927703323711",
  appId: "1:927703323711:web:96fbef341dcf93d6c4548a"
};


 initializeApp(firebaseConfig);

export const db =getFirestore()