import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router, RouterProvider, Navigate, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


import { AuthProvider } from "./context/auth-provider.jsx";

const queryClient = new QueryClient();

import Home from "./pages/Home.jsx";
import Perfil from "./pages/Perfil.jsx";
import Login from "./pages/Login.jsx";
import PrivateRoutes from "./pages/PrivateRoutes.jsx";
import { ThemeProvider } from "./context/theme-provider.jsx";
import ContasPagarPage from "./pages/financeiro/contas-pagar/ContasPagar.jsx";
import ContasReceberPage from "./pages/financeiro/contas-receber/ContasReceber.jsx";
import PageNotFound from "./pages/NotFound.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<App />}>
                  {/* Páginas protegidas isoladas */}
                  <Route element={<Home />} path="/" exact />
                  <Route element={<Perfil />} path="/perfil" />

                  {/* T&D */}

                  {/* Pessoal */}

                  {/* Comercial */}

                  {/* Suprimentos */}

                  {/* Qualidade */}

                  {/* Financeiro */}
                  <Route path="/financeiro/">
                    <Route element={<ContasPagarPage />} path="contas-a-pagar" />
                    <Route element={<ContasReceberPage />} path="contas-a-receber" />
                  </Route>
                  {/* Administração */}

                <Route element={<PageNotFound />} path="*" />
                </Route>
              </Route>

              <Route element={<Login />} path="/login" />
            </Routes>

            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>

  </React.StrictMode>
);
