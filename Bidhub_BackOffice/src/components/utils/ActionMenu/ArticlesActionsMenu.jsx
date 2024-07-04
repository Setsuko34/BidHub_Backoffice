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
import {DeleteArticle} from "../../view/ArticlesRelatedView/ArticleLogic";
import {doc, collection, query, where} from "firebase/firestore";

export default function ArticlesActionsMenu({articleId, refresh}) {
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const docRef = doc(db, "Articles", articleId);
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
    DeleteArticle(docRef, EncheresRef, setOpen, refresh);
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
