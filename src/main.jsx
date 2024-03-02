import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router, RouterProvider, Navigate, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/authProvider";

const queryClient = new QueryClient();

import Home from "./routes/Home.jsx";
import Perfil from "./routes/Perfil.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import Colab from "./routes/Colaborador.jsx";
import Login from "./routes/Login.jsx";
import PrivateRoutes from "./routes/PrivateRoutes.jsx";
import { ThemeProvider } from "./context/themeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">

            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route element={<Home />} path="/" exact />
                <Route element={<Perfil />} path="/pagamentos" />
              </Route>

              <Route element={<Login />} path="/login" />

            </Routes>

            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
