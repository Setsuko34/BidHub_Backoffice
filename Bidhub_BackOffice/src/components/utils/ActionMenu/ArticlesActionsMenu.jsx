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
import {useNavigate} from "react-router-dom";

import {
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";

import {ref, deleteObject} from "firebase/storage";
import {storage} from "../../../config/Firebase";

export default function ArticlesActionsMenu({articleId, refresh}) {
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const docRef = doc(db, "Articles", articleId);
  // const EncheresRef = collection(db, "Encheres", "id_articles" = articleId);
  const EncheresRef = query(
    collection(db, "Encheres"),
    where("id_articles", "==", articleId)
  );

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const handleDetail = () => {
    history(`/articleDetail/${articleId}`);
  };
  const handleDelete = async () => {
    console.log("Supprimer l'article");
    const EncheresArticles = await getDocs(EncheresRef);
    const doc = await getDoc(docRef);

    if (
      window.confirm(
        `Voulez-vous vraiment supprimer cet article et les ${EncheresArticles.size} enchères qui lui sont associées ?`
      )
    ) {
      // delete l'article dans storage
      doc.data().fileUrl &&
        deleteObject(ref(storage, doc.data().fileUrl))
          .then(() => {
            console.log("Article deleted successfully from storage");
          })
          .catch((error) => {
            console.error("Error deleting Article:", error);
          });
      // delete le document de l'utilisateur dans la base de données Firestore
      await deleteDoc(docRef)
        .then(() => {
          console.log("Articles deleted successfully from database");
        })
        .catch((error) => {
          console.error("Error deleting Article:", error);
        });

      // delete les enchères de l'article dans la base de données Firestore
      EncheresArticles.forEach(async (doc) => {
        await deleteDoc(doc.ref)
          .then(() => {
            console.log("Enchère supprimée avec succès");
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression de l'enchère:", error);
          });
      });
      setOpen(false);
      refresh(true);
    }
  };

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
        {/* <MenuItem
          variant="contained"
          color="primary"
          onClick={handleClose}
          disableRipple
        >
          <EditIcon />
          Modifier
        </MenuItem> */}
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
          onClick={handleDetail}
          disableRipple
        >
          <MoreHorizIcon />
          Voir Plus
        </MenuItem>
      </Menu>
    </div>
  );
}
