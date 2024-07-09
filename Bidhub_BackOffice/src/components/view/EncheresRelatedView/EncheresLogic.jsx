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

export const GetEncheres = async (idArticle, setEncheres) => {
  console.log("Get Encheres");
  console.log(idArticle);
  const encheresRef = query(
    collection(db, "Encheres"),
    where("id_article", "==", idArticle)
  );
  const docSnap = await getDocs(encheresRef);
  console.log("eee", docSnap);
  if (docSnap.docs.length > 0) {
    console.log(
      "Document data:",
      docSnap.docs.map((doc) => doc.data())
    );
    const a = docSnap.docs.map((doc) => doc.data());
    console.log("zzzzzz", a);
    setEncheres(docSnap.docs.map((doc) => doc.data()));
  } else {
    console.log("No such document!");
  }
};
