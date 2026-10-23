import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { InventoryItem, SurplusReview, DonationManifest } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as mandated by Firebase integration skill
export async function testFirestoreConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { connected: true, message: 'Firestore connection active' };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline mode active');
      return { connected: false, message: 'Client offline - using local storage sync' };
    }
    // If permission or missing doc, database is still reachable
    return { connected: true, message: 'Firestore reachable' };
  }
}

// Collection references
const INVENTORY_COLLECTION = 'inventory';
const REVIEWS_COLLECTION = 'surplusReviews';
const MANIFESTS_COLLECTION = 'donationManifests';

// Firestore CRUD Operations with error handling
export async function fetchInventoryFromFirestore(): Promise<InventoryItem[]> {
  try {
    const snap = await getDocs(collection(db, INVENTORY_COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<InventoryItem, 'id'>) }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, INVENTORY_COLLECTION);
  }
}

export async function saveInventoryItemToFirestore(item: InventoryItem): Promise<void> {
  const itemPath = `${INVENTORY_COLLECTION}/${item.id}`;
  try {
    const { id, ...data } = item;
    await setDoc(doc(db, INVENTORY_COLLECTION, id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, itemPath);
  }
}

export async function deleteInventoryItemFromFirestore(id: string): Promise<void> {
  const itemPath = `${INVENTORY_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, INVENTORY_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, itemPath);
  }
}

export async function saveSurplusReviewToFirestore(review: SurplusReview): Promise<void> {
  const reviewPath = `${REVIEWS_COLLECTION}/${review.id}`;
  try {
    const { id, ...data } = review;
    await setDoc(doc(db, REVIEWS_COLLECTION, id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, reviewPath);
  }
}

export async function fetchSurplusReviewsFromFirestore(): Promise<SurplusReview[]> {
  try {
    const snap = await getDocs(collection(db, REVIEWS_COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SurplusReview, 'id'>) }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, REVIEWS_COLLECTION);
  }
}

export async function saveDonationManifestToFirestore(manifest: DonationManifest): Promise<void> {
  const manifestPath = `${MANIFESTS_COLLECTION}/${manifest.id}`;
  try {
    const { id, ...data } = manifest;
    await setDoc(doc(db, MANIFESTS_COLLECTION, id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, manifestPath);
  }
}

export async function fetchDonationManifestsFromFirestore(): Promise<DonationManifest[]> {
  try {
    const snap = await getDocs(collection(db, MANIFESTS_COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DonationManifest, 'id'>) }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, MANIFESTS_COLLECTION);
  }
}

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign In failed:', err);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign Out failed:', err);
  }
}
