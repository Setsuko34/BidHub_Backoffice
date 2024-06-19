import React, {useState, useEffect} from "react";
import {Typography, Button, TextField, Box} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Appbar from "../../utils/AppBar";
import {db} from "../../../config/Firebase";
import {useNavigate, useParams} from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const ArticleDetail = () => {
  const {idArticle} = useParams();
  console.log("ArticleDetail idArticle", idArticle);
  const [isEditing, setIsEditing] = useState(false);
  const articleRef = doc(db, "Articles", idArticle);
  const encheresRef = query(
    collection(db, "Encheres"),
    where("id_articles", "==", idArticle)
  );
  const [article, setArticle] = useState({});
  const [encheres, setEncheres] = useState([]);

  const articleGetInfo = async () => {
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
  };

  useEffect(() => {
    articleGetInfo();
  }, []);

  const handleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Enregistrer les modifications de l'article
  };

  const handleChange = (e) => {
    setArticle({...article, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <Appbar />
      <Typography variant="h4">{article.title}</Typography>
      <Button variant="outlined" onClick={handleEdit}>
        <EditIcon />
        Modifier
      </Button>
      {isEditing ? (
        <div>
          <TextField
            name="description"
            label="Description"
            value={article.description}
            onChange={handleChange}
          />

          <Button variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      ) : (
        <div>
          <Typography>
            Date et heure de fin:{" "}
            {article.date_heure_fin?.toDate()?.toLocaleString()}
          </Typography>
          <Typography>Description: {article.description}</Typography>
          <Typography>ID utilisateur: {article.id_user}</Typography>
          <Typography>Prix de départ: {article.prix_depart}</Typography>
        </div>
      )}
      {encheres.length > 0 ? (
        <Box>
          <Typography>encheres</Typography>
          <DataGrid
            columns={[
              {field: "date_enchere", headerName: "Date enchère"},
              {field: "id_articles", headerName: "ID article"},
              {field: "id_user", headerName: "ID utilisateur"},
              {field: "montant", headerName: "Montant"},
            ]}
            rows={encheres}
            getRowId={(row) =>
              row.id_articles + row.id_user + row.date_enchere.seconds
            } // assuming this combination is unique for each row
          />
        </Box>
      ) : (
        <Typography>Aucune enchère pour cet article</Typography>
      )}
    </div>
  );
};

export default ArticleDetail;
