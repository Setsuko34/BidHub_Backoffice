import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {db} from "../../../config/Firebase";
import ArticlesActionsMenu from "../../utils/ActionMenu/ArticlesActionsMenu";
import {Avatar, Chip} from "@mui/material";

export const getAllArticles = async (setArticles, setLoading) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Articles"));
    console.log(querySnapshot);
    const ArticlesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setArticles(ArticlesList);
    setLoading(false);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    setLoading(false);
  }
};

export const GetInfo = async (
  articleRef,
  encheresRef,
  setArticle,
  setEncheres,
  setCreator
) => {
  const docSnap = await getDoc(articleRef);
  const encheresSnap = await getDocs(encheresRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    console.log(
      "encheres data:",
      encheresSnap.docs.map((doc) => doc.data())
    );

    setArticle(docSnap.data());
    setEncheres(encheresSnap.docs.map((doc) => doc.data()));
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  const creatorRef = doc(db, "Utilisateurs", docSnap.data().id_user);
  const creatorSnap = await getDoc(creatorRef);
  setCreator(creatorSnap.data());
  console.log("creator data:", creatorSnap.data());
};

export const UpdateArticle = async (articleRef, article) => {
  await updateDoc(articleRef, {
    ...article,
  });
  console.log("Document successfully updated!");
};

export const DeleteArticle = async (articleRef, encheresRef) => {};

export const DeleteEncheres = async (encheresRef) => {};
