import React, { useEffect, useState } from "react";
import { Typography, Button, AppBar, Toolbar, IconButton } from "@mui/material";
import { auth } from "../../config/Firebase";
import { styled } from "@mui/system";
import Appbar from "../utils/AppBar";

const MyComponent = styled("div")(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const Accueil = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Appbar position="static" user={user} />
      <Typography variant="h1">Bienvenue sur BidHub Backoffice</Typography>
      <Typography variant="body1">
        C'est ici que vous pouvez gérer les enchères et les produits de
        l'application BidHub.
      </Typography>
      <Button variant="contained" color="primary">
        Commencer
      </Button>
      {user && <Typography variant="body1">Email: {user.email}</Typography>}
    </div>
  );
};

export default Accueil;
