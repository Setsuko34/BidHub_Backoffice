import { useState } from "react";
import { app } from "./config/Firebase";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthView from "./components/Auth/AuthView";
import Accueil from "./components/view/Accueil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<AuthView />} />
        <Route path="/accueil" element={<Accueil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
