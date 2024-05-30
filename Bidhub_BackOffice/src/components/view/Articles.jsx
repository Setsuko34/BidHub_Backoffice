import React, {useEffect, useState} from "react";
import {Avatar} from "@mui/material";
import {DataGrid, GridToolbar } from "@mui/x-data-grid";
import {auth} from "../../config/Firebase";
import {styled} from "@mui/system";
import Appbar from "../utils/AppBar";
import {db} from "../../config/Firebase";
import {collection, getDocs} from "firebase/firestore";

const Articles = () => {
  const [Articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      field: "photo",
      headerName: "Photo",
      flex: 1,
      renderCell: (params) => (
        <Avatar
          src={params.row.photo}
          alt={params.row.name}
          sx={{width: 50, height: 50, borderRadius: "0%"}}
        />
      ),
    },
    {field: "title", headerName: "Titre", flex: 1},
    {field: "prix_depart", headerName: "Prix de départ", flex: 1},
    {field: "status", headerName: "Statut", flex: 1},
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Avatar
          src={params.row.photo}
          alt={params.row.name}
          sx={{width: 50, height: 50, borderRadius: "0%"}}
        />
      ),
    },
  ];
  const rows = Articles.map((article) => ({
    id: article.id,
    photo: article.photoURL,
    title: article.title || "N/A",
    prix_depart: article.prix_depart +' €' || "N/A",
    status: article.status|| "N/A",
  }));

  useEffect(() => {
    const fetchArticles = async () => {
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
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Appbar position="static" user={auth.currentUser} />
      <h1>Liste des Articles</h1>
      <div style={{height:'100%', width:'100%'}}>
        <DataGrid rows={rows} columns={columns} pageSize={5} slots={{toolbar:GridToolbar}} slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}/>
      </div>
    </div>
  );
};

export default Articles;
