import React, {useEffect, useState} from "react";
import {Chip, Box, Typography, Button} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {auth} from "../../../config/Firebase";
import Appbar from "../../utils/AppBar";
import ArticlesActionsMenu from "../../utils/ActionMenu/ArticlesActionsMenu";
import {getAllArticles} from "./ArticleLogic";
import ArticleModal from "../../utils/Modals/ArticleModal";
import axios from "axios";

const sendPushNotification = async (deviceToken, message) => {
  const url = "https://fcm.googleapis.com/fcm/send";
  const body = {
    to: deviceToken,
    notification: {
      title: message.title,
      body: message.body,
    },
  };
  const headers = {
    Authorization: "key=35c24cbf2f192ba0afac9bd1819016e3cd1f8566",
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, body, {headers});
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Exemple d'utilisation
const deviceToken = "DEVICE_TOKEN_HERE";
const message = {
  title: "Nouveau message",
  body: "Vous avez un nouveau message dans votre application.",
};

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
        <Button
          variant="contained"
          color="primary"
          onClick={() => sendPushNotification(deviceToken, message)}
        >
          Test d'envoi de notif
        </Button>
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
