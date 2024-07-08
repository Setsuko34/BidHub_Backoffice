import React, {useState, useEffect} from "react";
import {
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Appbar from "../../utils/AppBar";
import {useParams} from "react-router-dom";
import * as articleLogic from "./ArticleLogic";
import ArticleModal from "../../utils/Modals/ArticleModal";

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
          justifyContent: "right",
          paddingBottom: 5,
        }}
      >
        <ArticleModal
          article={article}
          setArticle={setArticle}
          idArticle={idArticle}
        />
      </Box>
      <Card sx={{maxWidth: "100%"}}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {article.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Createur : {creator.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date et heure de fin:{" "}
              {article.date_heure_fin?.toDate()?.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Prix de départ: {article.prix_depart}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Description de l'article : {article.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {encheres.length > 0 ? (
        <Box>
          <Typography> Encheres</Typography>
          <DataGrid
            columns={[
              {field: "date_enchere", headerName: "Date enchère"},
              {field: "id_user", headerName: "ID utilisateur"},
              {field: "montant", headerName: "Montant"},
            ]}
            rows={encheres}
            getRowId={(row) =>
              row.id_articles + row.id_user + row.date_enchere.seconds
            }
            // assuming this combination is unique for each row
            pageSize={5}
            slots={{toolbar: GridToolbar}}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      ) : (
        <Typography>Aucune enchère pour cet article</Typography>
      )}
    </div>
  );
};

export default ArticleDetail;
