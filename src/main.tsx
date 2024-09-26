import ReactDOM from "react-dom/client";

import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "./providers/theme-provider.tsx";

import { Toaster } from "./components/ui/toaster.tsx";
import { useAuthStore } from "./context/auth-store.tsx";
import { urlB64ToUint8Array } from "./helpers/format.ts";
import { api } from "./lib/axios.ts";
import QueryClientProviderComponent from "./providers/query-provider.tsx";
import AppRoutes from "./routes.tsx";

navigator.serviceWorker.register("/service-worker.js").then(async (serviceWorker) => {
  let subscription = await serviceWorker.pushManager.getSubscription();
  const user = useAuthStore.getState().user;
  if (!subscription) {
    console.log("Tá certo isso?");

    const publicKeyResponse = await api.get("/notification/public-key").then((res) => res.data);
    const applicationServerKey = urlB64ToUint8Array(publicKeyResponse);
    subscription = await serviceWorker.pushManager.subscribe({
      applicationServerKey,
      userVisibleOnly: true,
    });
  }

  await api.post("/notification/register", { subscription, user });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  //   <QueryClientProviderComponent>
  //     <Router>
  //       <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
  //         <AppRoutes />
  //       </ThemeProvider>
  //     </Router>
  //     <ReactQueryDevtools initialIsOpen={true} />
  //   </QueryClientProviderComponent>
  // </React.StrictMode>

  <QueryClientProviderComponent>
    {/* <SocketProvider> */}
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </Router>
    <Toaster />
    {/* </SocketProvider> */}
    <ReactQueryDevtools initialIsOpen={true} />
  </QueryClientProviderComponent>
);
