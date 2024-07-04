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
import {db, storage} from "../../../config/Firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import dayjs from "dayjs";
import "dayjs/locale/fr";

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

export const CreateArticle = async (
  article,
  file,
  refresh,
  setTitle,
  setDescription,
  setPrixDepart,
  setFile,
  setEndDate,
  setOpen
) => {
  const url = [];
  const fileName = dayjs().valueOf().toString();
  try {
    // Upload images to Firebase storage
    const fileRef = ref(storage, `articles/${fileName}`);
    const snapshot = await uploadBytes(fileRef, file);
    const urlSnap = await getDownloadURL(snapshot.ref);
    url.push(fileName);
    // Create new article in Firebase database
    const articlesRef = collection(db, "Articles");
    const newArticle = {
      title: article.title,
      description: article.description,
      prix_depart: Number(article.prixDepart),
      img_list: url,
      date_heure_debut: dayjs().toDate(),
      date_heure_fin: dayjs(article.endDate).toDate(),
      id_user: article.id_user,
    };

    await addDoc(articlesRef, newArticle);
    // Reset form fields and close modal
    setTitle("");
    setDescription("");
    setPrixDepart(0);
    setFile(null);
    setEndDate(dayjs());
    setOpen(false);
    refresh(true);
    console.log("Article created successfully!");
  } catch (error) {
    console.error("Error creating article:", error);
  }
};

export const DeleteArticle = async (docRef, EncheresRef, setOpen, refresh) => {
  // const docRef = doc(db, "Articles", articleId);
  // const EncheresRef = query(
  //   collection(db, "Encheres"),
  //   where("id_articles", "==", articleId)
  // );
  console.log("Supprimer l'article");
  const EncheresArticles = await getDocs(EncheresRef);
  const doc = await getDoc(docRef);

  if (
    window.confirm(
      `Voulez-vous vraiment supprimer cet article et les ${EncheresArticles.size} enchères qui lui sont associées ?`
    )
  ) {
    // delete l'article dans storage
    doc.data().fileUrl &&
      deleteObject(ref(storage, doc.data().fileUrl))
        .then(() => {
          console.log("Article deleted successfully from storage");
        })
        .catch((error) => {
          console.error("Error deleting Article:", error);
        });
    // delete le document de l'utilisateur dans la base de données Firestore
    await deleteDoc(docRef)
      .then(() => {
        console.log("Articles deleted successfully from database");
      })
      .catch((error) => {
        console.error("Error deleting Article:", error);
      });

    // delete les enchères de l'article dans la base de données Firestore
    EncheresArticles.forEach(async (doc) => {
      DeleteEnchere(doc.ref);
    });
    setOpen(false);
    refresh(true);
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
