import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvTE_01gl4JqTbnWazAe6wHZuLcWfAvBw",
    authDomain: "kanban-todo-app-42ade.firebaseapp.com",
    projectId: "kanban-todo-app-42ade",
    storageBucket: "kanban-todo-app-42ade.firebasestorage.app",
    messagingSenderId: "776076010703",
    appId: "1:776076010703:web:b215a18c359bafe76243ba"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
