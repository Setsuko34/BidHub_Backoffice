import React, {useEffect, useState} from "react";
import {Chip, Box, Typography} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {auth} from "../../../config/Firebase";
import Appbar from "../../utils/AppBar";
import ArticlesActionsMenu from "../../utils/ActionMenu/ArticlesActionsMenu";
import {Grid} from "react-loader-spinner";
import {getAllArticles} from "./ArticleLogic";
import ArticleModal from "../../utils/Modals/ArticleModal";

const Articles = () => {
  const [Articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Titre",
      flex: 1,
    },
    {
      field: "prix_depart",
      headerName: "Prix de départ",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Statut",
      flex: 1,
      headerAlign: "center",
      align: "center",
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
      headerName: "",
      width: 300,
      headerAlign: "center",
      align: "center",
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

  return (
    <div>
      <Appbar position="static" user={auth.currentUser} />
      <Box className="TitlewithButton">
        <Typography variant="h4">Liste des Articles</Typography>
        <ArticleModal user={auth.currentUser} refresh={setLoading} />
      </Box>

      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          sx={{height: "80vh", width: "100%"}}
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
