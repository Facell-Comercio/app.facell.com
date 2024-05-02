import { Route, Routes } from "react-router-dom";

import App from "./App.tsx";
import { checkUserPermission } from "./helpers/checkAuthorization.ts";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import NotAuthorizedPage from "./pages/NotAuthorized.tsx";
import PageNotFound from "./pages/NotFound.tsx";
import Perfil from "./pages/Perfil.tsx";
import PrivateRoutes from "./pages/PrivateRoutes.tsx";
import AdminPage from "./pages/admin/Page.tsx";
import CadastrosPage from "./pages/financeiro/cadastros/Cadastros.tsx";
import ContasPagarPage from "./pages/financeiro/contas-pagar/ContasPagar.tsx";
import ContasReceberPage from "./pages/financeiro/contas-receber/ContasReceber.tsx";
import OrcamentoPage from "./pages/financeiro/orcamento/Orcamento.tsx";
import { useEffect } from "react";
import { useAuthStore } from "./context/auth-store.tsx";

const AppRoutes = () => {
  const user = useAuthStore(state=>state.user);

  useEffect(()=>{

  }, [user])

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<App />}>
          {/* Páginas protegidas isoladas */}
          <Route element={<Home />} path="/" />
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
            <Route element={<OrcamentoPage />} path="orcamento" />
            <Route element={<CadastrosPage />} path="cadastros" />
          </Route>

          {/* Administração */}
          <Route
            element={
              checkUserPermission("MASTER") ? (
                <AdminPage />
              ) : (
                <NotAuthorizedPage />
              )
            }
            path="administracao"
          />

          <Route element={<PageNotFound />} path="*" />
        </Route>
      </Route>

      <Route element={<Login />} path="/login" />
    </Routes>
  );
};

export default AppRoutes;
