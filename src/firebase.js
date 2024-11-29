import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB3TrDLG_nfm02_NSDELRFU1KuJeuK9s7w",
  authDomain: "hirasurfa.firebaseapp.com",
  projectId: "hirasurfa",
  storageBucket: "hirasurfa.firebasestorage.app",
  messagingSenderId: "575061908882",
  appId: "1:575061908882:web:337eb3c11cc37bebe3754b",
  measurementId: "G-KMPDZ72X9C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Fonctions d'authentification
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Créer le profil utilisateur dans Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username,
      email,
      createdAt: new Date().toISOString(),
      settings: {
        sound: true,
        notifications: true,
        theme: "dark",
        interfaceLanguage: "fr",
        learningSpeed: "normal",
      },
      progress: {
        hiragana: {
          level: 0,
          progress: 0,
          charactersLearned: [],
        },
        katakana: {
          level: 0,
          progress: 0,
          charactersLearned: [],
        },
      },
    });

    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Fonctions de gestion des données utilisateur
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { data: userDoc.data(), error: null };
    }
    return { data: null, error: "User not found" };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateUserProgress = async (
  userId,
  script,
  level,
  progress,
  newCharacter = null
) => {
  try {
    const userRef = doc(db, "users", userId);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      throw new Error("User not found");
    }

    const currentProgress = userData.data().progress[script];
    const updatedCharacters = newCharacter
      ? [...currentProgress.charactersLearned, newCharacter]
      : currentProgress.charactersLearned;

    await updateDoc(userRef, {
      [`progress.${script}`]: {
        level,
        progress,
        charactersLearned: updatedCharacters,
      },
    });

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const updateUserSettings = async (userId, settings) => {
  try {
    await updateDoc(doc(db, "users", userId), { settings });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export { auth, db };
