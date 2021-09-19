import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdBFyvuLnl1MJjPIpYi8B8Ifjk3mcMHgs",
  authDomain: "react-ecommerce-c5107.firebaseapp.com",
  databaseURL: "https://react-ecommerce-c5107.firebaseio.com",
  projectId: "react-ecommerce-c5107",
  storageBucket: "react-ecommerce-c5107.appspot.com",
  messagingSenderId: "1080734269790",
  appId: "1:1080734269790:web:6caf936584de1fefae8fcf",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const createUserProfileDocument = async (
  userAuth,
  additionalData = {}
) => {
  if (!userAuth) return;

  const userRef = doc(db, "users", `${userAuth.uid}`);

  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error", error.message);
    }
  }

  return userRef;
};

export const auth = getAuth();
export const firestore = getFirestore();

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () =>
  signInWithPopup(auth, provider).catch((error) => console.log(error));

// export default firebase;
