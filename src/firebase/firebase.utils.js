import firebase from "firebase/app";
import "firebase";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyAK11BcPdV-mgMx37wqsx0iyrn2b7i1xvM",
  authDomain: "crown-db-71593.firebaseapp.com",
  projectId: "crown-db-71593",
  storageBucket: "crown-db-71593.appspot.com",
  messagingSenderId: "350177759526",
  appId: "1:350177759526:web:7578e86aa64b7339f271e7",
  measurementId: "G-GGT9WB5P27",
};

firebase.initializeApp(config);

export const fs = firebase.firestore();

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();
    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });
  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const userRef = fs.doc(`users/${userAuth.uid}`);
  const collectionRef = fs.collections("users");

  const snapShot = await userRef.get();
  const collectionSnapshot = await collectionRef.get();
  console.log(collectionSnapshot);

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }
  return userRef;
};

export const addCollectionsAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = fs.collection(collectionKey);

  const batch = fs.batch();
  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });
  return await batch.commit();
};

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
