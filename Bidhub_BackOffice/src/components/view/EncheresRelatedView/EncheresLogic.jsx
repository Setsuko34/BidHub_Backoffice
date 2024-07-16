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
  try {
    const encheresRef = query(
      collection(db, "Encheres"),
      where("id_article", "==", idArticle)
    );
    const docSnap = await getDocs(encheresRef);
    setEncheres(
      docSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des enchères:", error);
  }
};
export const getNumberEncheresByDay = async (
  setNumberEncheresByDay,
  setTotal
) => {
  try {
    const counterByDate = {};
    var totalEncheres = 0;
    const querySnapshot = await getDocs(collection(db, "Encheres"));
    console.log(querySnapshot.docs);
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const date = data.date_enchere.toDate().toLocaleDateString("fr-FR");
      if (date) {
        if (!counterByDate[date]) {
          counterByDate[date] = 1;
        } else {
          counterByDate[date] += 1;
        }
        totalEncheres += 1;
      }
    });

    // Convertir en tableau, trier, puis reconvertir en objet
    const sortedEntries = Object.entries(counterByDate).sort((a, b) => {
      const dateA = a[0].split("/").reverse().join("/");
      const dateB = b[0].split("/").reverse().join("/");
      return dateA.localeCompare(dateB);
    });
    const sortedCounterByDate = Object.fromEntries(sortedEntries);

    setNumberEncheresByDay(sortedCounterByDate);
    setTotal(totalEncheres);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des encheres par jour:",
      error
    );
  }
};

export const DeleteEnchere = async (encheresID, articleId, setEncheres) => {
  const encheresRef = doc(db, "Encheres", encheresID);
  await deleteDoc(encheresRef)
    .then(() => {
      console.log("Enchère supprimée avec succès");
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'enchère:", error);
    });
  GetEncheres({idArticle: articleId}, setEncheres);
};

export const CreateEnchere = async (enchereValue, setEncheres) => {
  console.log("Create Enchere");
  const enchereRef = collection(db, "Encheres");
  const newEnchere = {
    date_enchere: enchereValue.date_enchere,
    id_article: enchereValue.id_article,
    id_user: enchereValue.id_user,
    montant: enchereValue.montant,
  };

  await addDoc(enchereRef, newEnchere);
  GetEncheres({idArticle: enchereValue.id_article}, setEncheres);
};

export const UpdateEnchere = async (idEnchere, enchereValue, setEncheres) => {
  console.log("Update Enchere");
  const enchereRef = doc(db, "Encheres", idEnchere);
  await updateDoc(enchereRef, {...enchereValue});
  GetEncheres({idArticle: enchereValue.id_article}, setEncheres);
};
