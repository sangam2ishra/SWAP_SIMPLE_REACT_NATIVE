// Import Firebase dependencies for app2
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from "firebase/auth";

// Firebase configuration for the second app
const firebaseConfig2 = {
  apiKey: "AIzaSyAZbFXyaRVd0TPygLd5yAn-Px_t_CEkDdk",
  authDomain: "mern-auth-18120.firebaseapp.com",
  projectId: "mern-auth-18120",
  storageBucket: "mern-auth-18120.appspot.com",
  messagingSenderId: "411292307572",
  appId: "1:411292307572:web:a5c4a05f720dc52c384121"
};

// Initialize app2 and authentication with persistence
export const app2 = initializeApp(firebaseConfig2);
export const auth2 = initializeAuth(app2, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize storage for app2
export const storage = getStorage(app2);
