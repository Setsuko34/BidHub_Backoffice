import {db} from "../../../config/Firebase";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import dayjs from "dayjs";
import "dayjs/locale/fr";

export const GetEncheres = async ({idArticle}, setEncheres) => {
  console.log("Get Encheres");
  try {
    const encheresRef = query(
      collection(db, "Encheres"),
      where("id_article", "==", idArticle)
    );
    const docSnap = await getDocs(encheresRef);
    setEncheres(docSnap.docs.map((doc) => doc.data()));
  } catch (error) {
    console.error("Erreur lors de la récupération des enchères:", error);
  }
};

export const DeleteEnchere = async (encheresRef) => {
  await deleteDoc(encheresRef)
    .then(() => {
      console.log("Enchère supprimée avec succès");
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'enchère:", error);
    });
};
