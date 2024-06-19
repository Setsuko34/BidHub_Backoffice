import React, {useState, useRef} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {auth} from "../../../config/Firebase";
import {db} from "../../../config/Firebase";
import {doc, getDoc, deleteDoc} from "firebase/firestore";

export default function UsersActionsMenu({userId}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const docRef = doc(db, "Utilisateurs", userId);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    console.log("Supprimer l'utilisateur");

    //delete le document de l'utilisateur dans la base de données Firestore
    //fonctionnel
    // await deleteDoc(docRef)
    //   .then(() => {
    //     console.log("User deleted successfully");
    //   })
    //   .catch((error) => {
    //     console.error("Error deleting user:", error);
    //   });

    // Code to delete user from the authentication base in Firebase
    //non fonctionnel
    //TODO: Trouver une solution pour supprimer l'utilisateur de la base d'authentification
    //peut etre depuis une api nodejs avec : https://firebase.google.com/docs/auth/admin/manage-users#delete_a_user
    //     const admin = require('firebase-admin');
    // admin.initializeApp();

    // admin.auth().deleteUser(uid)
    //   .then(() => {
    //     console.log('Successfully deleted user');
    //   })
    //   .catch((error) => {
    //     console.log('Error deleting user:', error);
    //   });
    setOpen(false);
  };
  // Code to delete user from the authentication base in Firebase

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        endIcon={<KeyboardArrowDownIcon />}
        ref={anchorRef}
        onClick={handleToggle}
      >
        Actions
      </Button>
      <Menu
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "composition-button",
        }}
      >
        <MenuItem
          variant="contained"
          color="primary"
          onClick={handleClose}
          disableRipple
        >
          <EditIcon />
          Modifier
        </MenuItem>
        <MenuItem
          variant="contained"
          color="error"
          onClick={handleDelete}
          disableRipple
        >
          <DeleteIcon />
          Supprimer
        </MenuItem>
        <MenuItem
          variant="contained"
          color="success"
          onClick={handleClose}
          disableRipple
        >
          <MoreHorizIcon />
          Voir Plus
        </MenuItem>
      </Menu>
    </div>
  );
}
