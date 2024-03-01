import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { auth } from "../../config/Firebase"; // Replace with your Firebase Auth library

const Accueil = () => {
  // Initialize the Firebase Auth hook
  const [user, setUser] = useState(null); // State to store the user's information

  useEffect(() => {
    // Fetch the user's information from Firebase
    const fetchUser = async () => {
      const currentUser = await auth.currentUser;
      setUser(currentUser);
    };
    console.log(auth.currentUse);

    fetchUser();
  }, [auth]);

  return (
    <div>
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
