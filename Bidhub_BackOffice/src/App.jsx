import { useState } from "react";
import { app } from "./config/Firebase";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthView from "./components/Auth/AuthView";
import Accueil from "./components/view/Accueil";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./constants/theme";
import Profile from "./components/view/Profile";
import Users from "./components/view/Users";
import Articles from "./components/view/Articles";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<AuthView />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/articles" element={<Articles/>} />
          <Route path="/transactions" element={<h1>Produit</h1>} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
