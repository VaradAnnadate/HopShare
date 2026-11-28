import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId);
const app = firebaseEnabled ? (getApps().length ? getApp() : initializeApp(config)) : null;

let authInstance: ReturnType<typeof getAuth> | null = null;
if (app) {
  try {
    authInstance = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;
export const db = app ? getFirestore(app) : null;
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };

export type RideDocument = {
  id: string;
  from: string;
  to: string;
  date: 'Today' | 'Tomorrow';
  time: string;
  seats: number;
  capacity: number;
  fare: number;
  distance: string;
  duration: string;
  driver: string;
  rating: string;
  car: string;
  color: string;
  note: string;
  ownerId?: string;
  cloud?: boolean;
};

export function subscribeToRides(onRides: (rides: RideDocument[]) => void, onError: (error: Error) => void) {
  if (!db) return () => undefined;
  return onSnapshot(collection(db, 'rides'), (snapshot) => {
    onRides(snapshot.docs.map((rideDoc) => ({ id: rideDoc.id, ...rideDoc.data(), cloud: true } as RideDocument)));
  }, onError);
}

export async function createRide(ride: RideDocument, ownerId: string) {
  if (!db) throw new Error('Firebase is not configured.');
  const { id: _id, cloud: _cloud, ...rideFields } = ride;
  await addDoc(collection(db, 'rides'), { ...rideFields, ownerId, createdAt: serverTimestamp() });
}

export async function requestRideSeat(rideId: string) {
  if (!db) throw new Error('Firebase is not configured.');
  await runTransaction(db, async (transaction) => {
    const rideRef = doc(db!, 'rides', rideId);
    const rideSnapshot = await transaction.get(rideRef);
    if (!rideSnapshot.exists()) throw new Error('This ride is no longer available.');
    const availableSeats = Number(rideSnapshot.data().seats ?? 0);
    if (availableSeats < 1) throw new Error('This ride is full.');
    transaction.update(rideRef, { seats: availableSeats - 1 });
  });
}
