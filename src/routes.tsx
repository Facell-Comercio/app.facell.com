import { Route, Routes } from "react-router-dom";

import { useEffect } from "react";
import App from "./App.tsx";
import { useAuthStore } from "./context/auth-store.tsx";
import { checkUserDepartments, hasPermission } from "./helpers/checkAuthorization.ts";

import NotAuthorizedPage from "./pages/NotAuthorized.tsx";
import NotFoundPage from "./pages/NotFound.tsx";
import PrivateRoutes from "./pages/PrivateRoutes.tsx";

import HomePage from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import RecuperarSenha from "./pages/RecuperarSenha.tsx";
import AdminPage from "./pages/admin/Page.tsx";
import ComercialComissionamento from "./pages/comercial/comissionamento/ComercialComissionamento.tsx";
import ComercialMetas from "./pages/comercial/metas/ComercialMetas.tsx";
import ComercialVales from "./pages/comercial/vales/ComercialVales.tsx";
import { PageDashboard } from "./pages/dashboard/PageDashboard.tsx";
import CadastrosPage from "./pages/financeiro/cadastros/Cadastros.tsx";
import ContasPagarPage from "./pages/financeiro/contas-pagar/ContasPagar.tsx";
import ContasReceberPage from "./pages/financeiro/contas-receber/ContasReceber.tsx";
import ControleCaixaPage from "./pages/financeiro/controle-caixa/ControleCaixaPage.tsx";
import Caixas from "./pages/financeiro/controle-caixa/conferencia-caixa/caixas/Caixas.tsx";
import ConciliacaoBancariaPage from "./pages/financeiro/extratos-bancarios/Page.tsx";
import OrcamentoPage from "./pages/financeiro/orcamento/Orcamento.tsx";
import RelatoriosPage from "./pages/financeiro/relatorios/Relatorios.tsx";
import TesourariaPage from "./pages/financeiro/tesouraria/Tesouraria.tsx";
import CadastrosMarketingPage from "./pages/marketing/cadastros/CadastrosMarketing.tsx";
import MailingPage from "./pages/marketing/mailing/Mailing.tsx";
import Perfil from "./pages/perfil/index.tsx";
import Colaboradores from "./pages/pessoal/colaboradores/Colaboradores.tsx";
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
          <Route path="/pessoal/">
            <Route
              element={hasPermission("MASTER") ? <Colaboradores /> : <NotAuthorizedPage />}
              path="colaboradores"
            />
          </Route>

          {/* Comercial */}
          <Route path="/comercial/">
            <Route element={<ComercialVales />} path="vales" />
            <Route element={<ComercialMetas />} path="metas" />
            <Route element={<ComercialComissionamento />} path="comissionamento" />
          </Route>

          {/* Suprimentos */}

          {/* Qualidade */}

          {/* Financeiro */}
          <Route path="/financeiro/">
            <Route element={<ContasPagarPage />} path="contas-a-pagar" />
            <Route element={<ContasReceberPage />} path="contas-a-receber" />
            <Route element={<ControleCaixaPage />} path="controle-de-caixa">
              <Route path="conferencia-de-caixa">
                <Route
                  element={
                    checkUserDepartments("FINANCEIRO") || hasPermission("MASTER") ? (
                      <Caixas />
                    ) : (
                      <NotAuthorizedPage />
                    )
                  }
                  path="filiais"
                />
              </Route>
            </Route>
            <Route element={<OrcamentoPage />} path="orcamento" />
            <Route
              element={
                checkUserDepartments("FINANCEIRO") || hasPermission("MASTER") ? (
                  <ConciliacaoBancariaPage />
                ) : (
                  <NotAuthorizedPage />
                )
              }
              path="conciliacao-bancaria"
            />
            <Route
              element={
                checkUserDepartments("FINANCEIRO") || hasPermission("MASTER") ? (
                  <TesourariaPage />
                ) : (
                  <NotAuthorizedPage />
                )
              }
              path="tesouraria"
            />
            <Route element={<ConciliacaoBancariaPage />} path="conciliacao-bancaria" />
            <Route element={<CadastrosPage />} path="cadastros" />
            <Route element={<RelatoriosPage />} path="relatorios" />
          </Route>

          {/* Marketing */}
          <Route path="/marketing/">
            <Route
              element={
                checkUserDepartments("MARKETING") ||
                hasPermission(["MASTER", "MARKETING:MAILING_VER"]) ? (
                  <MailingPage />
                ) : (
                  <NotAuthorizedPage />
                )
              }
              path="mailing"
            />
            <Route
              element={
                checkUserDepartments("MARKETING", true) || hasPermission("MASTER") ? (
                  <CadastrosMarketingPage />
                ) : (
                  <NotAuthorizedPage />
                )
              }
              path="cadastros"
            />
          </Route>

          {/* Administração */}
          <Route
            element={hasPermission("MASTER") ? <AdminPage /> : <NotAuthorizedPage />}
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
