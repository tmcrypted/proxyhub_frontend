import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyDUVcl0rYIpfHhJa2cHRv5DqP5q4ni3Eeo",
    authDomain: "proxyhub-tmcrypted.firebaseapp.com",
    projectId: "proxyhub-tmcrypted",
    storageBucket: "proxyhub-tmcrypted.firebasestorage.app",
    messagingSenderId: "144772617469",
    appId: "1:144772617469:web:2fe422629f9a30d2c0da94",
    measurementId: "G-JZN68033QM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Export app instance
export default app; 