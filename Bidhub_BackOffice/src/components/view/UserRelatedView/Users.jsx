import React, {useEffect, useState} from "react";
import {Avatar} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {auth} from "../../../config/Firebase";
import Appbar from "../../utils/AppBar";
import {db} from "../../../config/Firebase";
import {collection, getDocs} from "firebase/firestore";
import UsersActionsMenu from "../../utils/ActionMenu/UsersActionsMenu";
import {Grid} from "react-loader-spinner";

const Users = () => {
  const [users, setUsers] = useState([]);
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
    {field: "name", headerName: "Nom", flex: 1},
    {field: "email", headerName: "Email", flex: 1},
    {field: "status", headerName: "Statut", flex: 1},
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => <UsersActionsMenu userId={params.row.id} />,
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
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Utilisateurs"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
      <h1>Liste des Utilisateurs</h1>
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
      </div>
    </div>
  );
};

export default Users;