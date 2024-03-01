import React, { useState } from "react";
import { app } from "../../config/Firebase";
import {
  Container,
  Input,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config/Firebase";
import { useNavigate } from "react-router-dom";

const AuthView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const history = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          var user = userCredential.user;
          console.log(user);
        }
      );
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("Aucun utilisateur trouvé avec cet email");
      } else if (error.code === "auth/wrong-password") {
        setError("Mot de passe incorrect");
      } else if (error.code === "auth/invalid-email") {
        setError("Cet email est invalide");
      } else if (error.code === "auth/too-many-requests") {
        setError("Trop de tentatives, veuillez réessayer plus tard");
      } else if (error.code === "auth/network-request-failed") {
        setError("Erreur de connexion, veuillez réessayer plus tard");
      }
      console.log(error);
    } finally {
      setLoading(false);
      history("/accueil");
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !passwordConfirm) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          var user = userCredential.user;
          user.sendEmailVerification();
          console.log(user);
        }
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé");
      } else if (error.code === "auth/invalid-email") {
        setError("Cet email est invalide");
      }
      console.log(error);
    } finally {
      setLoading(false);
      history("/accueil");
    }
  };

  const handleGoogleLogin = () => {
    const provider = new app.auth.GoogleAuthProvider();
    app.auth().signInWithPopup(provider);
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <Container style={styles.container}>
      <h1>
        Bienvenue sur <span style={styles.Bid}>Bid</span>
        <span style={styles.Hub}>Hub</span>
      </h1>
      <FormControl>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="on"
          variant="filled"
          style={styles.input}
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password">Mot de passe</InputLabel>
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="on"
          variant="filled"
          style={styles.input}
        />
      </FormControl>
      {!isSignIn && (
        <FormControl>
          <InputLabel htmlFor="passwordConfirm">
            Confirmer le mot de passe
          </InputLabel>
          <Input
            type="password"
            placeholder="Mot de passe"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="on"
            variant="filled"
            style={styles.input}
          />
        </FormControl>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {isSignIn ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={handleLogin} style={styles.button}>
            Se connecter
          </button>
          <a onClick={() => setIsSignIn(false)}>Pas encore de compte ?</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={handleSignup} style={styles.button}>
            S'inscrire
          </button>
          <a onClick={() => setIsSignIn(true)}>Déjà un compte ?</a>
        </div>
      )}
    </Container>
  );
};

export default AuthView;

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: "10px",
    border: "1px solid #ffa31a",
    paddingBottom: "20px",
    boxShadow: "0px 0px 25px 5px #ffa31a",
  },
  input: {
    width: "100%",
    padding: "10px 30px",
    margin: "10px 0",
    backgroundColor: "white",
    borderRadius: "10px",
  },
  button: {
    padding: "10px",
    margin: "10px 0",
  },
  link: {
    margin: "10px 0",
  },
  Bid: {
    backgroundColor: "#1b1b1b",
    padding: "0 5px 0 15px",
    borderRadius: "10px 0 0 10px",
  },
  Hub: {
    backgroundColor: "#ffa31a",
    padding: "0 15px 0 5px",
    borderRadius: "0 10px 10px 0",
    color: "#000",
  },
};
