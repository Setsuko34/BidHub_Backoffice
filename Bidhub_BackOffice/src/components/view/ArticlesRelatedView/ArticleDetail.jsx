import React, {useState, useEffect} from "react";
import {Typography, Button, TextField, Box} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import Appbar from "../../utils/AppBar";
import {useParams} from "react-router-dom";
import * as articleLogic from "./ArticleLogic";
import ArticleModal from "../../utils/ActionMenu/ArticleModal";

const ArticleDetail = () => {
  const {idArticle} = useParams();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({});
  const [encheres, setEncheres] = useState([]);
  const [creator, setCreator] = useState({}); //[creator, setCreator

  useEffect(() => {
    articleLogic.GetInfo(idArticle, setArticle, setEncheres, setCreator);
  }, [idArticle]);

  return (
    <div>
      <Appbar />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">{article.title}</Typography>
        <ArticleModal
          article={article}
          setArticle={setArticle}
          idArticle={idArticle}
        />
      </Box>
      <div>
        <Typography>
          Date et heure de fin:{" "}
          {article.date_heure_fin?.toDate()?.toLocaleString()}
        </Typography>
        <Typography>Description: {article.description}</Typography>
        <Typography>Createur : {creator.username}</Typography>
        <Typography>Prix de départ: {article.prix_depart}</Typography>
      </div>
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
