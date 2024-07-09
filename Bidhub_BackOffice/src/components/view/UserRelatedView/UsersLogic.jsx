import {db} from "../../../config/Firebase";
import {collection, getDocs} from "firebase/firestore";

export const GetAllUsers = async (setUsers) => {
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
