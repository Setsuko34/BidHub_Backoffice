import React, {useState, useEffect} from "react";
import {Modal, Button, TextField} from "@mui/material";
import Addicon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  CreateArticle,
  UpdateArticle,
} from "../../view/ArticlesRelatedView/ArticleLogic";

dayjs.locale("fr");
dayjs().format("DD/MM/YYYY HH:mm:ss");

const ArticleModal = ({user, refresh, article, setArticle, idArticle}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [prixDepart, setPrixDepart] = useState(0);
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState(dayjs());
  const [imgList, setImgList] = useState([]);
  const [file, setFile] = useState(null);
  const [articleValue, setArticleValue] = useState({
    title: title,
    description: description,
    prix_depart: prixDepart,
    date_heure_fin: endDate,
    img_list: imgList,
  });
  useEffect(() => {
    if (
      article &&
      article.title &&
      article.description &&
      article.prix_depart &&
      article.date_heure_fin &&
      article.img_list
    ) {
      console.log(article.id);
      setTitle(article.title);
      setDescription(article.description);
      setPrixDepart(article.prix_depart);
      setEndDate(dayjs(article.date_heure_fin.toDate()));
      setImgList(article.img_list);
    }
  }, [article]);

  useEffect(() => {
    setArticleValue({
      title: title,
      description: description,
      prix_depart: Number(prixDepart),
      date_heure_fin: dayjs(endDate).toDate(),
      img_list: imgList,
    });
  }, [title, description, prixDepart, endDate, imgList]);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFile(null);
    setOpen(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    console.log("articleValue", articleValue);
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
  const handleUpdateArticle = async () => {
    console.log("Update article");
    console.log("articleValue", articleValue);
    UpdateArticle(idArticle, articleValue, file);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        {article ? <EditIcon /> : <Addicon />}
        {article ? "Mettre à jour" : "Ajouter"}
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
          <h2 id="add-article-modal">
            {article ? "Mettre à jour" : "Ajouter"} un Article
          </h2>
          <TextField
            label="Titre de l'article"
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
            sx={{marginBottom: 2}}
          >
            Télécharger le fichier
            <input
              type="file"
              accept="image/*, video/*, pdf/*, audio/*"
              onChange={handleImageChange}
              style={{display: "none"}}
            />
          </Button>
          <span style={{marginBottom: 20, marginTop: 0}}>
            {file ? file.name : "aucun fichier séléctionné"}
          </span>
          <Button
            variant="contained"
            color="primary"
            onClick={article ? handleUpdateArticle : handleCreateArticle}
            sx={{marginBottom: 3}}
          >
            {article ? "Sauvegarder" : "Créer l'article"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleModal;
