import React, {useState, useEffect} from "react";
import {Modal, Button, TextField, MenuItem} from "@mui/material";
import Addicon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");
dayjs().format("DD/MM/YYYY HH:mm:ss");

const EnchereModal = ({enchere, setEncheres, idEnchere}) => {
  const [open, setOpen] = useState(false);
  const [prix, setPrix] = useState(0);
  const [creaDate, setCreaDate] = useState(dayjs());
  const [id_user, setIdUser] = useState();
  const [enchereValue, setEnchereValue] = useState({
    date_enchere: dayjs(creaDate).toDate(),
    id_article: "",
    id_user: "",
    montant: 0,
  });
  useEffect(() => {
    if (enchere) {
      setEnchereValue({enchere});
      setIdUser(enchere.id_user);
      setPrix(enchere.montant);
      setCreaDate(dayjs(enchere.date_enchere.toDate()));
      console.log(enchere);
    }
  }, [enchere]);

  useEffect(() => {
    setEnchereValue({
      date_enchere: dayjs(creaDate).toDate(),
      id_user: id_user,
      montant: Number(prix),
    });
  }, [creaDate, id_user, prix]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handlePrixChange = (event) => {
    setPrix(event.target.value);
  };

  const handleUserChange = (event) => {
    setIdUser(event.target.value);
  };

  const handleCreateEnchere = async () => {
    console.log("Create Enchere");
  };
  const handleUpdateEnchere = async () => {
    console.log("Update Enchere");
    console.log("enchereValue", enchereValue);
    // UpdateEnchere(idEnchere, enchereValue, refresh, setOpen);
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
