import React, {useState, useRef} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {useNavigate} from "react-router-dom";
import {DeleteArticle} from "../../view/ArticlesRelatedView/ArticleLogic";

export default function ArticlesActionsMenu({articleId, refresh}) {
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

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
    DeleteArticle(articleId, setOpen, refresh);
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
