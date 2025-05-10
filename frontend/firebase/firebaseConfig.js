import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

const firebaseConfig = { 
    apiKey: Constants.expoConfig.extra.firebaseApiKey,
    authDomain: Constants.expoConfig.extra.firebaseAuthDomain, 
    projectId: Constants.expoConfig.extra.firebaseProjectId, 
    storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
    messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId, 
    appId: Constants.expoConfig.extra.firebaseAppId,
}; 

console.log("Using Firebase API Key:", Constants.expoConfig.extra.firebaseApiKey);
console.log('FIREBASE CONFIG', firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig); 
export const auth = getAuth(firebaseApp);