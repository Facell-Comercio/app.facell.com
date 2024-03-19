import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from "./providers/theme-provider.tsx";

import QueryClientProviderComponent from "./providers/query-provider.tsx";
import AppRoutes from "./routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProviderComponent>
      <Router>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AppRoutes/>
            <Toaster />
          </ThemeProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProviderComponent>
  </React.StrictMode>
);