import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, Timestamp, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Safely initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with Database ID (Critical!)
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth (for error reporting)
const auth = getAuth(app);

export { db, collection, addDoc, getDocs, query, orderBy, limit, Timestamp, serverTimestamp, doc, updateDoc, deleteDoc };

export interface Review {
  id?: string;
  name: string;
  rating: number; // 1-5
  text: string;
  meta: string; // e.g., "Local Guide", "Cliente"
  date: string; // formatted date
  createdAt: any; // Firestore Timestamp
  approved?: boolean; // Set to true to override and make reviews visible to everyone
}

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
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const DEFAULT_REVIEWS: Omit<Review, "createdAt">[] = [
  {
    name: "Ilaria Peccerillo",
    meta: "Local Guide · 71 recensioni",
    rating: 5,
    text: "I veri sapori della Puglia. Accolti con i classici taralli olive e cacioricotta. Antipasti sfiziosi ed abbondanti, buonissimo il primo e sfiziose le bombette... per una serata mi è sembrato di essere tornata a Martina Franca.",
    date: "3 mesi fa"
  },
  {
    name: "dona dona",
    meta: "Local Guide · 254 recensioni",
    rating: 5,
    text: "Ristorantino con specialità pugliesi nel piccolo centro commerciale Colombia. Bellissima atmosfera con musica di sottofondo, cibo superlativo, abbiamo mangiato benissimo e con porzioni abbondanti. Ottime le bombette assaggiate!",
    date: "6 mesi fa"
  },
  {
    name: "Ivan Balducci",
    meta: "Local Guide · 42 recensioni",
    rating: 5,
    text: "Bellissimo ristorante situato in zona Infernetto. Si può mangiare l'autentica cucina pugliese con ottimi antipasti, focaccia pugliese eccezionale e buonissime le bombette di carne. Abbiamo provato anche i panzerotti nella serata dedicata.",
    date: "7 mesi fa"
  },
  {
    name: "Simone Criscuolo",
    meta: "Local Guide · 1.024 recensioni",
    rating: 5,
    text: "Locale molto accogliente con posti sia all'interno che in un giardino riservato e tranquillo. L'offerta culinaria rispetta le aspettative, ottima cucina pugliese con tante specialità tipiche.",
    date: "3 settimane fa"
  },
  {
    name: "Claudio",
    meta: "Local Guide · 672 recensioni",
    rating: 5,
    text: "Un ristorante che rispecchia molto la cucina tipica pugliese, prodotti tipici e di qualità a prezzo giusto. Personale gentile e competente.",
    date: "1 mese fa"
  },
  {
    name: "cla Udio",
    meta: "Local Guide · 313 recensioni",
    rating: 5,
    text: "Locale e personale molto accogliente! Tutti i loro prodotti sono originari della Puglia… abbiamo preso tagliere antipasti, focaccia e vari tipi di bombette! Tutto di alta qualità! Il prezzo é giusto! Lo consiglio.",
    date: "8 mesi fa"
  }
];

export function getDefaultReviewsWithTimestamps(): Review[] {
  return DEFAULT_REVIEWS.map((rev, index) => ({
    ...rev,
    id: `default-${index}`,
    createdAt: Timestamp.now()
  }));
}

export async function fetchReviews(attemptedSeed = false): Promise<Review[]> {
  const path = "reviews";
  try {
    const reviewsRef = collection(db, path);
    const q = query(reviewsRef, orderBy("createdAt", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        name: data.name,
        rating: data.rating,
        text: data.text,
        meta: data.meta,
        date: data.date,
        createdAt: data.createdAt,
        approved: data.approved !== undefined ? data.approved : false,
      });
    });
    
    // Seed default reviews if none exist yet and we haven't attempted to seed yet
    if (reviews.length === 0 && !attemptedSeed) {
      console.log("No reviews found. Attempting to seed default reviews...");
      const success = await seedDefaultReviews();
      if (success) {
        return fetchReviews(true); // Fetch again after seeding
      } else {
        console.warn("Seeding failed. Falling back to default reviews.");
        return getDefaultReviewsWithTimestamps();
      }
    } else if (reviews.length === 0 && attemptedSeed) {
      console.warn("Seeding completed but no reviews returned. Falling back to default reviews.");
      return getDefaultReviewsWithTimestamps();
    }
    
    return reviews;
  } catch (error) {
    console.error("Error in fetchReviews: ", error);
    // If the error is permission denied, we report it. But we MUST return fallback reviews so the user's interface is fully loaded and functional.
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (loggedError) {
      // Just log and fall back to displaying beautiful static reviews
      console.error("Logged firestore error, continuing with fallback: ", loggedError);
    }
    return getDefaultReviewsWithTimestamps();
  }
}

export async function seedDefaultReviews(): Promise<boolean> {
  const path = "reviews";
  try {
    const reviewsRef = collection(db, path);
    for (const review of DEFAULT_REVIEWS) {
      await addDoc(reviewsRef, {
        ...review,
        createdAt: serverTimestamp(),
      });
    }
    console.log("Default reviews seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding default reviews: ", error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (loggedError) {
      console.error("Logged firestore write error during seeding: ", loggedError);
    }
    return false;
  }
}

export async function submitReview(review: Omit<Review, "createdAt">): Promise<string | null> {
  const path = "reviews";
  try {
    const reviewsRef = collection(db, path);
    const docRef = await addDoc(reviewsRef, {
      ...review,
      createdAt: serverTimestamp(),
      approved: review.rating >= 4, // Auto-approve 4 and 5 stars! Under moderation for <= 3 stars
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting review: ", error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (loggedError) {
      console.error("Logged firestore write error during submission: ", loggedError);
    }
    return null;
  }
}

export async function approveReview(id: string): Promise<boolean> {
  const path = `reviews/${id}`;
  try {
    const reviewDocRef = doc(db, "reviews", id);
    await updateDoc(reviewDocRef, {
      approved: true,
    });
    return true;
  } catch (error) {
    console.error("Error approving review: ", error);
    try {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } catch (loggedError) {
      console.error("Logged error during approval: ", loggedError);
    }
    return false;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  const path = `reviews/${id}`;
  try {
    const reviewDocRef = doc(db, "reviews", id);
    await deleteDoc(reviewDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting review: ", error);
    try {
      handleFirestoreError(error, OperationType.DELETE, path);
    } catch (loggedError) {
      console.error("Logged error during delete: ", loggedError);
    }
    return false;
  }
}
