// Firebase initialization and helpers
// Fill the config below with your Firebase project credentials from the Firebase Console.
// This uses the official Web SDK which works with Expo managed projects.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getDatabase, ref, set as rSet, update as rUpdate, onValue, off, query, orderByChild, equalTo } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMI07oUxDbXSGW7ZMeFBCZSwEshtOW66A",
  authDomain: "cognicore-6c0c8.firebaseapp.com",
  databaseURL: "https://cognicore-6c0c8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cognicore-6c0c8",
  storageBucket: "cognicore-6c0c8.firebasestorage.app",
  messagingSenderId: "636084013806",
  appId: "1:636084013806:web:33e427ab1de4ad5e3701ff"
};

// Initialize Firebase (singleton)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth instance with proper persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (e) {
    // If already initialized (Fast Refresh), fall back to existing instance
    auth = getAuth(app);
  }
}

// App instance created above; no additional ensure step needed

export const initFirebase = () => {
  return {
    auth,
    db: getFirestore(app),
  };
};

export const signInAnonymouslyIfNeeded = async () => {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return auth.currentUser;
};

// Email/Password Auth APIs
export const createAccount = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
};

export const loginWithEmail = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const onAuthChanged = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const saveDriverProfile = async (profile) => {
  const db = getFirestore(app);
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const ref = doc(db, 'drivers', user.uid);
  const snap = await getDoc(ref);
  const base = {
    ...profile,
    uid: user.uid,
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    base.createdAt = serverTimestamp();
  }
  await setDoc(ref, base, { merge: true });

  return user.uid;
};

// --- Realtime Database Helpers (RTDB) ---
export const getDb = () => getDatabase(app);

// Locations: /locations/{driverId}
export const setDriverLocation = async (driverId, latitude, longitude) => {
  const db = getDatabase(app);
  const locRef = ref(db, `locations/${driverId}`);
  const payload = {
    currentLatitude: latitude,
    currentLongitude: longitude,
    lastUpdated: new Date().toISOString(),
  };
  await rSet(locRef, payload);
  return payload;
};

export const subscribeDriverLocation = (driverId, callback) => {
  const db = getDatabase(app);
  const locRef = ref(db, `locations/${driverId}`);
  const handler = (snap) => callback(snap.val());
  onValue(locRef, handler);
  return () => off(locRef, 'value', handler);
};

// Trips: /trips/{tripId}
export const upsertTrip = async (tripId, data) => {
  const db = getDatabase(app);
  const tRef = ref(db, `trips/${tripId}`);
  await rUpdate(tRef, data);
};

export const subscribeActiveTripsForDriver = (driverId, callback) => {
  // RTDB supports one orderByChild filter; filter tripCompleted in client
  const db = getDatabase(app);
  const tripsQuery = query(ref(db, 'trips'), orderByChild('driverId'), equalTo(driverId));
  const handler = (snap) => {
    const val = snap.val() || {};
    const list = Object.entries(val)
      .map(([id, t]) => ({ id, ...t }))
      .filter((t) => !t.tripCompleted);
    callback(list);
  };
  onValue(tripsQuery, handler);
  return () => off(tripsQuery, 'value', handler);
};

export const updateTripStatus = async (tripId, statusPatch) => {
  const db = getDatabase(app);
  const tRef = ref(db, `trips/${tripId}`);
  await rUpdate(tRef, statusPatch);
};

// Schedules: /schedules/{driverId}/{scheduleId}
export const upsertSchedule = async (driverId, scheduleId, data) => {
  const db = getDatabase(app);
  const sRef = ref(db, `schedules/${driverId}/${scheduleId}`);
  await rUpdate(sRef, data);
};

export const updateScheduleStatus = async (driverId, scheduleId, status) => {
  const db = getDatabase(app);
  const sRef = ref(db, `schedules/${driverId}/${scheduleId}`);
  await rUpdate(sRef, { status });
};

export const subscribeSchedules = (driverId, callback) => {
  const db = getDatabase(app);
  const sRef = ref(db, `schedules/${driverId}`);
  const handler = (snap) => {
    const val = snap.val() || {};
    const list = Object.entries(val).map(([id, s]) => ({ id, ...s }));
    callback(list);
  };
  onValue(sRef, handler);
  return () => off(sRef, 'value', handler);
};

// Ratings: /ratings/{driverId}/{tripId}
export const submitRating = async (driverId, tripId, rating, comment = '') => {
  const db = getDatabase(app);
  const rRef = ref(db, `ratings/${driverId}/${tripId}`);
  await rUpdate(rRef, {
    rating: Number(rating) || 0,
    comment,
    timestamp: new Date().toISOString(),
  });
};

export const subscribeRatings = (driverId, callback) => {
  const db = getDatabase(app);
  const rRef = ref(db, `ratings/${driverId}`);
  const handler = (snap) => {
    const val = snap.val() || {};
    const list = Object.entries(val).map(([tripId, r]) => ({ tripId, ...r }));
    const avg = list.length ? list.reduce((a, b) => a + (b.rating || 0), 0) / list.length : 0;
    callback({ ratings: list, average: avg });
  };
  onValue(rRef, handler);
  return () => off(rRef, 'value', handler);
};

export default {
  initFirebase,
  signInAnonymouslyIfNeeded,
  saveDriverProfile,
  getDb,
  setDriverLocation,
  subscribeDriverLocation,
  upsertTrip,
  subscribeActiveTripsForDriver,
  updateTripStatus,
  upsertSchedule,
  updateScheduleStatus,
  subscribeSchedules,
  submitRating,
  subscribeRatings,
  createAccount,
  loginWithEmail,
  logout,
  onAuthChanged,
};
