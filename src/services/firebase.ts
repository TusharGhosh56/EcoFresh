import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { UserCredential } from 'firebase/auth';

// Your web app's Firebase configuration
// Configuration for eco-fresh2255 project
const firebaseConfig = {
  apiKey: "AIzaSyCEhQXk7xbrkvd-slj4S8VfgYeCcpil6Cg",
  authDomain: "eco-fresh2255.firebaseapp.com",
  projectId: "eco-fresh2255",
  storageBucket: "eco-fresh2255.appspot.com",
  messagingSenderId: "347289442120",
  appId: "1:347289442120:web:384949dc512e3b632c857d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export { auth, db };

import { doc, getDoc, setDoc } from 'firebase/firestore'

export async function getUserPinnedCities(uid: string): Promise<string[]> {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  const data = docSnap.exists() ? docSnap.data().pinnedCities || [] : []
  console.log('Firebase getUserPinnedCities result:', data)
  return data
}

export async function saveUserPinnedCities(uid: string, cities: string[]) {
  const docRef = doc(db, 'users', uid)
  await setDoc(docRef, { pinnedCities: cities }, { merge: true })
}

export async function getUserMonitoringStats(uid: string): Promise<{ name: string, count: number }[]> {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  const data = docSnap.exists() ? docSnap.data().monitoringStats || [] : []
  console.log('Firebase getUserMonitoringStats result:', data)
  return data
}

export async function incrementCityMonitorCount(uid: string, city: string) {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  const currentStats = docSnap.exists() ? docSnap.data().monitoringStats || [] : []
  const stats = [...currentStats] // Create a copy to avoid mutating
  const idx = stats.findIndex((item: { name: string, count: number }) => item.name === city)
  if (idx >= 0) {
    stats[idx].count += 1
  } else {
    stats.push({ name: city, count: 1 })
  }
  await setDoc(docRef, { monitoringStats: stats }, { merge: true })
}

export async function removeCityFromPinned(uid: string, cityName: string) {
  const currentCities = await getUserPinnedCities(uid)
  const updatedCities = currentCities.filter(city => city !== cityName)
  await saveUserPinnedCities(uid, updatedCities)
  return updatedCities
}

// Debug function to check Firebase data structure
export async function debugUserData(uid: string) {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  const userData = docSnap.exists() ? docSnap.data() : null
  console.log('Complete user data from Firebase:', userData)
  return userData
}