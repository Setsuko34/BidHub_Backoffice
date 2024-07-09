import React, {useState, useEffect} from "react";
import {Modal, Button, TextField} from "@mui/material";
import Addicon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");
dayjs().format("DD/MM/YYYY HH:mm:ss");

const EnchereModal = ({
  user,
  refresh,
  enchere,
  setEnchere,
  idEnchere,
  idArticle,
}) => {
  const [open, setOpen] = useState(false);
  const [prix, setPrix] = useState(0);
  const [creaDate, setCreaDate] = useState(dayjs());
  const [id_user, setIdUser] = useState(user.uid);
  const [enchereValue, setEnchereValue] = useState({
    date_enchere: creaDate,
    id_article: idArticle,
    id_user: id_user,
    montant: prix,
  });
  useEffect(() => {
    if (enchere) {
      console.log(enchere);
    }
  }, [enchere]);

  useEffect(() => {
    setArticleValue({
      date_enchere: dayjs(creaDate).toDate(),
      id_article: idArticle,
      id_user: id_user,
      montant: Number(prix),
    });
  }, [creaDate, idArticle, id_user, prix]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setFile(null);
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
    // console.log("articleValue", articleValue);
    // UpdateArticle(idArticle, articleValue, file, imgArray, refresh, setOpen);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        {enchere ? <EditIcon /> : <Addicon />}
        {enchere ? "Mettre à jour" : "Ajouter"}
      </Button>
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
