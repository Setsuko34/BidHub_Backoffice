import React, {useState, useEffect} from "react";
import {Modal, Button, TextField, MenuItem} from "@mui/material";
import Addicon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs().format("DD/MM/YYYY HH:mm:ss");
import axios from "axios";

const UserModal = ({user, refresh}) => {
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setUsername(user.name);
      setStatus(user.status);
      setUid(user.id);
    }
  }, [user]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setEmail("");
    setUsername("");
    setStatus("");
    setPassword("");
    setOpen(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const handleCreateUser = async () => {
    console.log("Create user");
    try {
      if (email === "" || username === "" || status === "" || password === "") {
        setError("Veuillez remplir tous les champs");
        return;
      }

      let data = JSON.stringify({
        email: email,
        username: username,
        status: status,
        password: password,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://us-central1-bidhub-56b3f.cloudfunctions.net/createUser",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log("Error :", error);
        });
    } catch (error) {
      console.log("Error creating user:", error.message);
    }
    handleClose();
    refresh(true);
  };

  const handleUpdateUser = async () => {
    console.log("Update user");
    try {
      if (email === "" || username === "" || status === "") {
        setError("Veuillez remplir tous les champs");
        return;
      }

      let data = JSON.stringify({
        uid: uid,
        user: {
          email: email,
          username: username,
          status: status,
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://us-central1-bidhub-56b3f.cloudfunctions.net/updateUser",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log("Error :", error);
        });
    } catch (error) {
      console.log("Error creating user:", error.message);
    }
    handleClose();
    refresh(true);
  };

  return (
    <div>
      {user ? (
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
        aria-labelledby="add-user-modal"
        aria-describedby="add-user-modal-description"
      >
        <div
          className="modal-content"
          style={{
            width: "50%",
          }}
        >
          <h2 id="add-user-modal">
            {user ? "Mettre à jour" : "Ajouter"} un Utilisateur
          </h2>
          <TextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
            sx={{marginBottom: 3}}
          />
          <TextField
            label="Nom d'utilisateur"
            value={username}
            onChange={handleUsernameChange}
            sx={{marginBottom: 3}}
          />
          <TextField
            label="Statut"
            value={status}
            onChange={handleStatusChange}
            sx={{marginBottom: 3}}
          />

          {!user ? (
            <TextField
              label="Mot de passe"
              value={password}
              onChange={handlePasswordChange}
              sx={{marginBottom: 3}}
            />
          ) : (
            ""
          )}
          {error && <p style={{color: "red"}}>{error}</p>}
          <Button
            variant="contained"
            color="primary"
            onClick={user ? handleUpdateUser : handleCreateUser}
            sx={{marginBottom: 3}}
          >
            {user ? "Sauvegarder" : "Créer l'user"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserModal;
