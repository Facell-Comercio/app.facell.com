import { Routes, Route } from "react-router-dom";

import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Perfil from "./pages/Perfil.tsx";
import Login from "./pages/Login.tsx";
import PrivateRoutes from "./pages/PrivateRoutes.tsx";
import ContasPagarPage from "./pages/financeiro/contas-pagar/ContasPagar.tsx";
import ContasReceberPage from "./pages/financeiro/contas-receber/ContasReceber.tsx";
import PageNotFound from "./pages/NotFound.tsx";

const AppRoutes = () => {
    return ( <Routes>
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
            </Route>
            {/* Administração */}

            <Route element={<PageNotFound />} path="*" />
          </Route>
        </Route>

        <Route element={<Login />} path="/login" />
      </Routes> );
}
 
export default AppRoutes;