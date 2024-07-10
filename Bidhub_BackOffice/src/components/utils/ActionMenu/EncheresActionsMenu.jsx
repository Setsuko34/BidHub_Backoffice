import React, {useState, useRef} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EnchereModal from "../Modals/EnchereModal";
import {DeleteEnchere} from "../../view/EncheresRelatedView/EncheresLogic";

export default function EncheresActionsMenu({
  enchereId,
  enchere,
  setEncheres,
  idArticle,
}) {
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
  const handleDelete = async () => {
    DeleteEnchere(enchereId, idArticle.idArticle, setEncheres, setOpen);
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
        <EnchereModal
          enchere={enchere}
          setEncheres={setEncheres}
          idEnchere={enchereId}
          idArticle={idArticle}
        />
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
