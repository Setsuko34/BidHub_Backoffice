import React, {useState, useEffect} from "react";
import {Modal, Button, TextField} from "@mui/material";
import Addicon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {CreateArticle} from "../../view/ArticlesRelatedView/ArticleLogic";

dayjs.locale("fr");
dayjs().format("DD/MM/YYYY HH:mm:ss");

const AddArticleModal = ({user, refresh, idarticle}) => {
  //   const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [prixDepart, setPrixDepart] = useState(0);
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState(dayjs());
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (idarticle) {
      //TODO : set values et le récuperer avec firebase et les afficher dans les champs
      setTitle(idarticle.title);
      setDescription(idarticle.description);
      setPrixDepart(idarticle.prix_depart);
      setEndDate(dayjs(idarticle.date_heure_fin));
    }
  }, [idarticle]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handlePrixDepartChange = (event) => {
    setPrixDepart(event.target.value);
  };

  const handleCreateArticle = async () => {
    const article = {
      title,
      description,
      prixDepart,
      endDate,
      id_user: user.uid,
    };
    CreateArticle(
      article,
      file,
      refresh,
      setTitle,
      setDescription,
      setPrixDepart,
      setFile,
      setEndDate,
      setOpen
    );
  };
  // TODO : faire le contenue de la fonction handleUpdateArticle a savoir, update l'article avec les nouvelles valeurs, supprimer l'ancien fichier et le remplacer par le nouveau
  const handleUpdateArticle = async () => {};

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        <Addicon />
        Ajouter
      </Button>
      <Modal
        className="modal"
        open={open}
        onClose={handleClose}
        aria-labelledby="add-article-modal"
        aria-describedby="add-article-modal-description"
      >
        <div
          className="modal-content"
          style={{
            width: "50%",
          }}
        >
          <h2 id="add-article-modal">Ajouter un Article</h2>
          <TextField
            label="Title"
            value={title}
            onChange={handleTitleChange}
            sx={{marginBottom: 3}}
          />
          <TextField
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
            sx={{marginBottom: 3}}
          />
          <TextField
            label="Prix de départ"
            value={prixDepart}
            onChange={handlePrixDepartChange}
            type="number"
            sx={{marginBottom: 3}}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Fin de l'enchère"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              sx={{marginBottom: 3}}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{marginBottom: 3}}
          >
            Télécharger le fichier
            <input
              type="file"
              accept="image/*, video/*, pdf/*, audio/*"
              onChange={handleImageChange}
              style={{display: "none"}}
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={idarticle ? handleUpdateArticle : handleCreateArticle}
            sx={{marginBottom: 3}}
          >
            {idarticle ? "Sauvegarder" : "Créer l'article"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddArticleModal;
