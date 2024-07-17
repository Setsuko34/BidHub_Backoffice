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
import UserModal from "../Modals/UserModal";

export default function UsersActionsMenu({
  userId,
  user,
  refresh,
  setOpenDelete,
  setUserToDelete,
}) {
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
    setUserToDelete(user.id);
    setOpenDelete(true);
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
        <UserModal user={user} refresh={refresh} />
        <MenuItem
          variant="contained"
          color="error"
          onClick={handleDelete}
          disableRipple
        >
          <DeleteIcon />
          Supprimer
        </MenuItem>
      </Menu>
    </div>
  );
}
