import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBxl3XAJPdJCsulNW_y986yWZI71RRNnkI",
    authDomain: "personal-website-3580d.firebaseapp.com",
    projectId: "personal-website-3580d",
    storageBucket: "personal-website-3580d.appspot.com",
    messagingSenderId: "508647798578",
    appId: "1:508647798578:web:82dc231a174aa0cbb0892b",
    measurementId: "G-QGWC8Z9P92",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;
