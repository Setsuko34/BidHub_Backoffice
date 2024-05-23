import React, {useEffect, useState} from "react";
import {Typography, Avatar, Button, TextField} from "@mui/material";
import {auth, db, storage} from "../../config/Firebase"; // Remplacer avec votre configuration Firebase
import Appbar from "../utils/AppBar";
import {useNavigate} from "react-router-dom";
import {updateProfile, updateEmail} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore"; // Pour mettre à jour les informations supplémentaires stockées dans Firestore
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [newPhoto, setNewPhoto] = useState(null); // Pour stocker le fichier de la nouvelle photo

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
        setPhotoURL(currentUser.photoURL || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    const currentUser = auth.currentUser;

    try {
      // Si une nouvelle photo a été sélectionnée, téléchargez-la d'abord
      let updatedPhotoURL = photoURL;
      if (newPhoto) {
        const photoRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(photoRef, newPhoto);
        updatedPhotoURL = await getDownloadURL(photoRef);
        setPhotoURL(updatedPhotoURL); // Mettre à jour l'état avec la nouvelle URL de la photo
      }

      await updateProfile(currentUser, {
        displayName,
        photoURL: updatedPhotoURL,
      });
      await updateEmail(currentUser, email);

      // Si vous stockez des informations supplémentaires dans Firestore, mettez-les à jour ici
      const userDoc = doc(db, "Utilisateurs", currentUser.uid);
      await updateDoc(userDoc, {
        email,
        username: displayName,
        photoURL: updatedPhotoURL,
      });

      console.log("Informations mises à jour avec succès");
      setUser({
        ...currentUser,
        displayName,
        email,
        photoURL: updatedPhotoURL,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations: ", error);
    }
  };

  const handlePhotoChange = (event) => {
    if (event.target.files[0]) {
      setNewPhoto(event.target.files[0]);
    }
  };

  const deleteUser = async () => {
    const currentUser = auth.currentUser;
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      try {
        await db.collection("Utilisateurs").doc(currentUser.uid).delete();
        await currentUser.delete();
        console.log("Compte Supprimé avec succès");
        navigate("/");
      } catch (error) {
        console.error("Erreur lors de la suppression du compte: ", error);
      }
    } else {
      console.log("Suppression annulée");
    }
  };

  return (
    <div>
      <Appbar position="static" user={user} />
      {user ? (
        <>
          <input
            accept="image/*"
            style={{display: "none"}}
            id="raised-button-file"
            type="file"
            onChange={handlePhotoChange}
          />
          <label htmlFor="raised-button-file">
            <Avatar
              src={photoURL}
              alt={displayName}
              sx={{width: 200, height: 200, cursor: "pointer"}}
            />
          </label>
          <TextField
            label="Pseudo"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            variant="filled"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Photo URL"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            variant="filled"
            fullWidth
            margin="normal"
            disabled
          />
          <Button
            variant="contained"
            color="primary"
            style={{marginRight: 10, marginTop: 20}}
            onClick={handleUpdateProfile}
          >
            Mettre à jour le profil
          </Button>

          <Button
            variant="contained"
            color="error"
            style={{marginTop: 20}}
            onClick={deleteUser}
          >
            Clôturer mon compte
          </Button>
        </>
      ) : (
        <Typography variant="body1">Chargement...</Typography>
      )}
    </div>
  );
};

export default Profile;
