import React, {useState, useEffect} from "react";
import {Modal, Button, TextField, MenuItem, Autocomplete} from "@mui/material";
import Addicon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {GetAllUsers} from "../../view/UserRelatedView/UsersLogic";
import {
  CreateEnchere,
  UpdateEnchere,
} from "../../view/EncheresRelatedView/EncheresLogic";

dayjs.locale("fr");
dayjs().format("DD/MM/YYYY HH:mm:ss");

const EnchereModal = ({enchere, idEnchere, setEncheres, idArticle}) => {
  const [open, setOpen] = useState(false);
  const [prix, setPrix] = useState(0);
  const [creaDate, setCreaDate] = useState(dayjs());
  const [id_user, setIdUser] = useState();
  const [users, setUsers] = useState([]);

  const [enchereValue, setEnchereValue] = useState({
    date_enchere: dayjs(creaDate).toDate(),
    id_article: idArticle,
    id_user: "",
    montant: 0,
  });
  useEffect(() => {
    if (enchere && idEnchere) {
      setEnchereValue({enchere});
      setIdUser(enchere.id_user);
      setPrix(enchere.montant);
      setCreaDate(dayjs(enchere.date_enchere.toDate()));
    }
    GetAllUsers(setUsers);
  }, [enchere]);

  useEffect(() => {
    setEnchereValue({
      date_enchere: dayjs(creaDate).toDate(),
      id_article: idArticle.idArticle,
      id_user: id_user,
      montant: Number(prix),
    });
  }, [creaDate, id_user, prix]);

  const handleOpen = () => {
    setOpen(true);
    console.log(users);
  };
  const handleClose = () => {
    setOpen(false);
    setEnchereValue({
      date_enchere: dayjs().toDate(),
      id_user: "",
      montant: 0,
    });
    setPrix(0);
    setIdUser("");
  };

  const handlePrixChange = (event) => {
    setPrix(event.target.value);
  };

  const handleUserChange = (event) => {
    setIdUser(event.target.value);
  };

  const handleCreateEnchere = async () => {
    console.log("Create Enchere");
    console.log("enchereValue", enchereValue);
    CreateEnchere(enchereValue, setEncheres, setOpen);
    handleClose();
  };
  const handleUpdateEnchere = async () => {
    console.log("Update Enchere");
    console.log("enchereValue", enchereValue);
    UpdateEnchere(idEnchere, enchereValue, setEncheres);
    handleClose();
  };

  return (
    <div>
      {enchere ? (
        <MenuItem
          variant="contained"
          color="primary"
          onClick={handleOpen}
          disableRipple
        >
          <EditIcon />
          Modifier
        </MenuItem>
      ) : (
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          <Addicon />
          Ajouter
        </Button>
      )}

      <Modal
        className="modal"
        open={open}
        onClose={handleClose}
        aria-labelledby="add-enchere-modal"
        aria-describedby="add-enchere-modal-description"
      >
        <div
          className="modal-content"
          style={{
            width: "50%",
          }}
        >
          <h2 id="add-enchere-modal">
            {enchere ? "Mettre à jour" : "Ajouter"} une enchere
          </h2>

          <TextField
            label="Montant de l'enchère"
            value={prix}
            onChange={handlePrixChange}
            type="number"
            sx={{marginBottom: 3}}
          />

          <Autocomplete
            id="user"
            options={users}
            getOptionLabel={(option) => option.username}
            getOptionKey={(option) => option.id}
            value={users.find((user) => user.id === id_user)}
            sx={{marginBottom: 3}}
            onChange={(event, newValue) => {
              setIdUser(newValue.id);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Utilisateur" />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={enchere ? handleUpdateEnchere : handleCreateEnchere}
            sx={{marginBottom: 3}}
          >
            {enchere ? "Sauvegarder" : "Créer l'enchere"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EnchereModal;
