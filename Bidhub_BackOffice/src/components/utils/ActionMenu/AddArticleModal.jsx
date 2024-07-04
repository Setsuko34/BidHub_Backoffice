import React, {useState} from "react";
import {Modal, Button, TextField} from "@mui/material";
import {collection, addDoc} from "firebase/firestore";
import {auth, db, storage} from "../../../config/Firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import Addicon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");
dayjs().format("DD/MM/YYYY HH:mm:ss");

const AddArticleModal = ({user, refresh}) => {
  //   const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [prixDepart, setPrixDepart] = useState(0);
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState(dayjs());
  const [file, setFile] = useState(null);

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
    const url = [];
    try {
      // Upload images to Firebase storage
      const fileRef = ref(storage, `articles/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const urlSnap = await getDownloadURL(snapshot.ref);
      url.push(urlSnap);
      // Create new article in Firebase database
      const articlesRef = collection(db, "Articles");
      const newArticle = {
        title: title,
        description: description,
        prix_depart: Number(prixDepart),
        img_list: url,
        date_heure_debut: dayjs().toDate(),
        date_heure_fin: dayjs(endDate).toDate(),
        id_user: user.uid,
      };

      await addDoc(articlesRef, newArticle);
      // Reset form fields and close modal
      setTitle("");
      setDescription("");
      setPrixDepart(0);
      setFile(null);
      setEndDate(dayjs());
      setOpen(false);
      refresh(true);
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

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
            onClick={handleCreateArticle}
            sx={{marginBottom: 3}}
          >
            Créer l'article
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddArticleModal;
