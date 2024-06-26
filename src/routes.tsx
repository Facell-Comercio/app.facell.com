import { Route, Routes } from "react-router-dom";

import { useEffect } from "react";
import App from "./App.tsx";
import { useAuthStore } from "./context/auth-store.tsx";
import { checkUserPermission } from "./helpers/checkAuthorization.ts";

import NotAuthorizedPage from "./pages/NotAuthorized.tsx";
import NotFoundPage from "./pages/NotFound.tsx";
import PrivateRoutes from "./pages/PrivateRoutes.tsx";

import HomePage from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import RecuperarSenha from "./pages/RecuperarSenha.tsx";
import AdminPage from "./pages/admin/Page.tsx";
import { PageDashboard } from "./pages/dashboard/PageDashboard.tsx";
import CadastrosPage from "./pages/financeiro/cadastros/Cadastros.tsx";
import ContasPagarPage from "./pages/financeiro/contas-pagar/ContasPagar.tsx";
import ContasReceberPage from "./pages/financeiro/contas-receber/ContasReceber.tsx";
import ConciliacaoBancariaPage from "./pages/financeiro/extratos-bancarios/Page.tsx";
import OrcamentoPage from "./pages/financeiro/orcamento/Orcamento.tsx";
import Perfil from "./pages/perfil/index.tsx";
import { VideoAulaPage } from "./pages/treinamento/videoaula/Page.tsx";

const AppRoutes = () => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {}, [user]);

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<App />}>
          <Route element={<NotAuthorizedPage />} path="/not-authorized" />
          {/* Páginas protegidas isoladas */}
          <Route element={<HomePage />} path="/" />
          <Route element={<PageDashboard />} path="/dashboard" />

          {/* T&D */}
          <Route path="/treinamento/">
            <Route element={<VideoAulaPage />} path="videoaula" />
          </Route>

          {/* Pessoal */}

          {/* Comercial */}

          {/* Suprimentos */}

          {/* Qualidade */}

          {/* Financeiro */}
          <Route path="/financeiro/">
            <Route element={<ContasPagarPage />} path="contas-a-pagar" />
            <Route element={<ContasReceberPage />} path="contas-a-receber" />
            <Route element={<OrcamentoPage />} path="orcamento" />
            <Route
              element={<ConciliacaoBancariaPage />}
              path="conciliacao-bancaria"
            />
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

          <Route element={<Perfil />} path="perfil" />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Route>

      <Route element={<LoginPage />} path="/login" />
      <Route element={<RecuperarSenha />} path="/recuperar-senha" />
    </Routes>
  );
};

export default AppRoutes;
