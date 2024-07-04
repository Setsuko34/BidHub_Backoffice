import React, {useEffect, useState} from "react";
import {Avatar, Chip, Box, Typography, Button} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {auth} from "../../../config/Firebase";
import Appbar from "../../utils/AppBar";
import {db} from "../../../config/Firebase";
import {collection, getDocs} from "firebase/firestore";
import ArticlesActionsMenu from "../../utils/ActionMenu/ArticlesActionsMenu";
import {Grid} from "react-loader-spinner";
import Addicon from "@mui/icons-material/Add";
import {getAllArticles} from "./ArticleLogic";
import AddArticleModal from "../../utils/ActionMenu/AddArticleModal";

const Articles = () => {
  const [Articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {field: "id", headerName: "ID", flex: 1},
    {field: "title", headerName: "Titre", flex: 1},
    {field: "prix_depart", headerName: "Prix de départ", flex: 1},
    {
      field: "status",
      headerName: "Statut",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          style={{
            backgroundColor: params.row.status === "En cours" ? "green" : "red",
            color: "white",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <ArticlesActionsMenu
          articleId={params.row.actions}
          refresh={setLoading}
        />
      ),
    },
  ];
  const rows = Articles.map((article) => ({
    id: article.id,
    title: article.title || "N/A",
    prix_depart: article.prix_depart + " €" || "N/A",
    status:
      article.date_heure_fin?.toDate?.() > new Date()
        ? "En cours"
        : "Terminée" || "N/A",
    actions: article.id,
  }));

  useEffect(() => {
    getAllArticles(setArticles, setLoading);
  }, [loading]);

  if (loading) {
    return (
      <div className="page-centered">
        <Grid
          visible={true}
          height="80"
          width="80"
          color="#FFA31A"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      </div>
    );
  }

  return (
    <div>
      <Appbar position="static" user={auth.currentUser} />
      <Box className="TitlewithButton">
        <Typography variant="h4">Liste des Articles</Typography>
        <AddArticleModal user={auth.currentUser} refresh={setLoading} />
      </Box>

      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          slots={{toolbar: GridToolbar}}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </div>
  );
};

export default Articles;
