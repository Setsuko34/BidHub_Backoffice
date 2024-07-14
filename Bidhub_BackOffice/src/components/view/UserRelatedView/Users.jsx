import React, {useEffect, useState} from "react";
import {Avatar} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {auth} from "../../../config/Firebase";
import Appbar from "../../utils/AppBar";
import UsersActionsMenu from "../../utils/ActionMenu/UsersActionsMenu";
import {GetAllUsers} from "./UsersLogic";
import UserModal from "../../utils/Modals/UserModal";
import {Box, Typography} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");

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
    {field: "name", headerName: "Nom", flex: 1},
    {field: "email", headerName: "Email", flex: 1},
    {field: "status", headerName: "Statut", flex: 1},
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <UsersActionsMenu
          userId={params.row.id}
          user={params.row}
          refresh={setLoading}
          setOpenDelete={setOpenDelete}
          setUserToDelete={setUserToDelete}
        />
      ),
    },
  ];
  const rows = users.map((user) => ({
    id: user.id,
    photo: user.photoURL,
    name: user.username || "N/A",
    email: user.email || "N/A",
    status: user.status || "N/A",
    actions: user.id,
  }));

  useEffect(() => {
    GetAllUsers(setUsers).finally(() => setLoading(false));
  }, [loading]);

  const handleDelete = async () => {
    console.log("Supprimer l'utilisateur");
    console.log("user id", userToDelete);
    try {
      if (userToDelete === "") {
        setError("Aucun utilisateur sélectionné, suppression impossible");
        return;
      }

      let data = JSON.stringify({
        uid: userToDelete,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://us-central1-bidhub-56b3f.cloudfunctions.net/deleteUser",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log("Error :", error);
        });
    } catch (error) {
      console.log("Error deleting user:", error.message);
    }
    setOpenDelete(false);
    setLoading(true);
  };

  return (
    <div>
      <Appbar position="static" user={auth.currentUser} />
      <Box className="TitlewithButton">
        <Typography variant="h4">Liste des Utilisateurs</Typography>
        <UserModal refresh={setLoading} />
      </Box>
      <div style={{height: "100%", width: "100%"}}>
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
        <Dialog maxWidth="sx" open={openDelete}>
          <DialogTitle>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?{" "}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body">
              La suppresion de l'utilisateur entrainera la suppression de toutes
              les données associées à cet utilisateur.
              <br />
              (Articles, Enchères, etc...)
              <br />
              Cette action est irréversible.
              <br />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Annuler</Button>
            <Button onClick={handleDelete}>Supprimer</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Users;
