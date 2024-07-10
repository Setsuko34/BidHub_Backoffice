import {db} from "../../../config/Firebase";
import {collection, getDocs, doc, getDoc} from "firebase/firestore";

export const GetAllUsers = async (setUsers) => {
  console.log("Get All Users");
  try {
    const querySnapshot = await getDocs(collection(db, "Utilisateurs"));
    const usersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersList);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
  }
};

export const GetUser = async (id, setUser) => {
  const userRef = doc(db, "Utilisateurs", id);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    setUser(docSnap.data());
  } else {
    console.log("No such document!");
  }
};
