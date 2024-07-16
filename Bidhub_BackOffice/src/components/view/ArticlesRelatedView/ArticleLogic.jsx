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
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {DeleteEnchere} from "../EncheresRelatedView/EncheresLogic";
import {GetUser} from "../UserRelatedView/UsersLogic";

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

export const getNumberArticlesByDay = async (
  setNumberArticlesByDay,
  setTotal
) => {
  try {
    const counterByDate = {};
    var totalArticles = 0;
    const querySnapshot = await getDocs(collection(db, "Articles"));
    console.log(querySnapshot.docs);
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const date = data.date_heure_debut.toDate().toLocaleDateString("fr-FR");
      if (date) {
        if (!counterByDate[date]) {
          counterByDate[date] = 1;
        } else {
          counterByDate[date] += 1;
        }
        totalArticles += 1;
      }
    });

    // Convertir en tableau, trier, puis reconvertir en objet
    const sortedEntries = Object.entries(counterByDate).sort((a, b) => {
      const dateA = a[0].split("/").reverse().join("/");
      const dateB = b[0].split("/").reverse().join("/");
      return dateA.localeCompare(dateB);
    });
    const sortedCounterByDate = Object.fromEntries(sortedEntries);

    setNumberArticlesByDay(sortedCounterByDate);
    setTotal(totalArticles);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
  }
};

export const GetInfo = async (idArticle, setArticle, setCreator) => {
  const articleRef = doc(db, "Articles", idArticle);
  const docSnap = await getDoc(articleRef);
  if (docSnap.exists()) {
    setArticle(docSnap.data());
  } else {
    console.log("No such document!");
  }
  GetUser(docSnap.data().id_user, setCreator);
};

export const CreateArticle = async (
  article,
  file,
  imgArray,
  refresh,
  setTitle,
  setImgArray,
  setDescription,
  setPrixDepart,
  setFile,
  setEndDate,
  setOpen
) => {
  const url = [];
  try {
    if (imgArray.length === 0) {
      console.error("No images to upload!");
      return;
    }
    const ImgArraySnap = imgArray.map(async (img) => {
      const fileName = dayjs().valueOf().toString();
      const fileRef = ref(storage, `articles/preview/${fileName}`);
      const snapshot = await uploadBytes(fileRef, img);
      const urlSnap = await getDownloadURL(snapshot.ref);
      url.push(urlSnap);
    });
    await Promise.all(ImgArraySnap).then(async () => {
      // Upload article
      const ArtName = dayjs().valueOf().toString();
      const articleRef = ref(storage, `articles/article/${ArtName}`);
      const snapshotArt = await uploadBytes(articleRef, file);
      const urlArt = await getDownloadURL(snapshotArt.ref);
      // Create new article in Firebase database
      const articlesRef = collection(db, "Articles");
      const newArticle = {
        title: article.title,
        description: article.description,
        prix_depart: Number(article.prixDepart),
        img_list: url,
        url_article: urlArt,
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
      setImgArray([]);
      setEndDate(dayjs());
      setOpen(false);
      refresh(true);
      console.log("Article created successfully!");
    });
  } catch (error) {
    console.error("Error creating article:", error);
  }
};

export const UpdateArticle = async (
  idArticle,
  article,
  file,
  imgArray,
  refresh,
  setOpen
) => {
  const articleRef = doc(db, "Articles", idArticle);
  try {
    const doc = await getDoc(articleRef);
    console.log("file", file);
    console.log("imgArray", imgArray.length > 0);
    //on récupère le document de l'article afin de récupérer les images et si on a file avec quelque chose on supprime les images de l'article pour mettre la nouvelle
    if (file != null) {
      deleteObject(ref(storage, doc.data().url_article))
        .then(() => {
          console.log("Article deleted successfully from storage");
        })
        .catch((error) => {
          console.error("Error deleting Article:", error);
        });
      const fileName = dayjs().valueOf().toString();
      const fileRef = ref(storage, `articles/article/${fileName}`);
      const snapshot = await uploadBytes(fileRef, file);
      const urlSnap = await getDownloadURL(snapshot.ref);
      article.url_article = urlSnap;
    }
    if (imgArray.length > 0) {
      const imgArrayDel = doc.data().img_list.map(async (img) => {
        deleteObject(ref(storage, img))
          .then(() => {
            console.log("Article deleted successfully from storage");
          })
          .catch((error) => {
            console.error("Error deleting Article:", error);
          });
      });
      await Promise.all(imgArrayDel).then(async () => {
        article.img_list = [];
        const ImgArraySnap = imgArray.map(async (img) => {
          const fileName = dayjs().valueOf().toString();
          const fileRef = ref(storage, `articles/preview/${fileName}`);
          const snapshot = await uploadBytes(fileRef, img);
          const urlSnap = await getDownloadURL(snapshot.ref);
          article.img_list.push(urlSnap);
        });
        await Promise.all(ImgArraySnap);
      });
    }
    console.log(article);
    await updateDoc(articleRef, {
      ...article,
    });
    console.log("Document successfully updated!");
    refresh(true);
    setOpen(false);
  } catch (error) {
    console.error("Error updating article:", error);
  }
};

export const DeleteArticle = async (articleId, setOpen, refresh) => {
  console.log("Supprimer l'article");
  const docRef = doc(db, "Articles", articleId);
  const EncheresRef = query(
    collection(db, "Encheres"),
    where("id_article", "==", articleId)
  );
  const EncheresArticles = await getDocs(EncheresRef);
  const document = await getDoc(docRef);

  if (
    window.confirm(
      `Voulez-vous vraiment supprimer cet article et les ${EncheresArticles.size} enchères qui lui sont associées ?`
    )
  ) {
    await Promise.all(
      document.data().img_list.map(async (img) => {
        // getDownloadURL(ref(storage, `articles/${img}`)).then((url) => {
        deleteObject(ref(storage, img))
          .then(() => {
            console.log("Article deleted successfully from storage");
          })
          .catch((error) => {
            console.error("Error deleting Article:", error);
          });
      })
    );
    await deleteObject(ref(storage, document.data().url_article))
      .then(() => {
        console.log("Article deleted successfully from storage");
      })
      .catch((error) => {
        console.error("Error deleting Article:", error);
      });

    //delete le document de l'utilisateur dans la base de données Firestore
    await deleteDoc(docRef)
      .then(() => {
        console.log("Articles deleted successfully from database");
      })
      .catch((error) => {
        console.error("Error deleting Article:", error);
      });

    setOpen(false);
    refresh(true);
  }
};
