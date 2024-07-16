import React, {useEffect, useState} from "react";
import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Box,
} from "@mui/material";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";
import {auth} from "../../config/Firebase";
import {styled} from "@mui/system";
import Appbar from "../utils/AppBar";
import {getNumberArticlesByDay} from "./ArticlesRelatedView/ArticleLogic";
import {getNumberEncheresByDay} from "./EncheresRelatedView/EncheresLogic";

const MyComponent = styled("div")(({theme}) => ({
  color: theme.palette.primary.main,
}));

const Accueil = () => {
  const [user, setUser] = useState(null);
  const [dataArticles, setDataArticles] = useState({});
  const [dataEncheres, setDataEncheres] = useState({});
  const [nbArt, setNbArt] = useState(0);
  const [nbEnch, setNbEnch] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await getNumberArticlesByDay(setDataArticles, setNbArt);
      await getNumberEncheresByDay(setDataEncheres, setNbEnch);
    };

    fetchData();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container maxWidth="xl">
      <Appbar position="static" user={user} />
      <Typography variant="h1">Bienvenue sur BidHub Backoffice</Typography>
      <Typography variant="body1">
        C'est ici que vous pouvez gérer les enchères et les produits de
        l'application BidHub.
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flex: "1",
          marginTop: "30px",
          borderTop: "1px solid #565656",
          paddingTop: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "column",
            flex: "1",
          }}
        >
          <Typography variant="h4">
            Nombre total d'Articles : {nbArt}
          </Typography>
          <LineChart
            labelData="Articles"
            xAxis={[{scaleType: "point", data: Object.keys(dataArticles)}]}
            series={[
              {
                data: Object.values(dataArticles),
                type: "line",
                label: "Nombre d'articles postés par jour",
                color: "#FFA31A",
              },
            ]}
            width={700}
            height={500}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "column",
            flex: "1",
          }}
        >
          <Typography variant="h4">
            Nombre total d'Encheres : {nbEnch}
          </Typography>
          <LineChart
            labelData="Encheres"
            xAxis={[{scaleType: "point", data: Object.keys(dataEncheres)}]}
            series={[
              {
                data: Object.values(dataEncheres),
                type: "line",
                label: "Nombres d'enchères faites par jour",
                color: "#ffb547",
              },
            ]}
            width={700}
            height={500}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Accueil;
