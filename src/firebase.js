import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  setDoc,
  doc,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDFOQSl4TXQsO2xB4fFdxJNlkkMrSQzExE",
  authDomain: "classychat-8c563.firebaseapp.com",
  databaseURL: "https://classychat-8c563-default-rtdb.firebaseio.com",
  projectId: "classychat-8c563",
  storageBucket: "classychat-8c563.appspot.com",
  messagingSenderId: "236996415227",
  appId: "1:236996415227:web:336b463d0c53d26db76a5e"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const userid = user.uid;
    await setDoc(doc(db, "users", userid), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};