import React, {useState} from "react";
import {Modal, Button, TextField} from "@mui/material";
import {db} from "../../../config/Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Addicon from "@mui/icons-material/Add";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AddArticleModal = () => {
  //   const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

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
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
  };

  const handleCreateArticle = () => {
    // Upload images to Firebase storage
    const storageRef = db.storage().ref();
    const imageUrls = [];

    images.forEach((image) => {
      const imageRef = storageRef.child(`images/${image.name}`);
      imageRef.put(image).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          imageUrls.push(url);

          // Create new article in Firebase database
          const articlesRef = db.database().ref("Articles");
          const newArticle = {
            title: title,
            description: description,
            images: imageUrls,
          };

          articlesRef.push(newArticle);

          // Reset form fields and close modal
          setTitle("");
          setDescription("");
          setImages([]);
          setOpen(false);
        });
      });
    });
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
        <div className="modal-content">
          <h2 id="add-article-modal">Add Article</h2>
          <TextField label="Title" value={title} onChange={handleTitleChange} />
          <TextField
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Fin de l'enchère"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateArticle}
          >
            Create Article
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddArticleModal;
