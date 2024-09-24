import ReactDOM from "react-dom/client";

import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "./providers/theme-provider.tsx";

import { Toaster } from "./components/ui/toaster.tsx";
import QueryClientProviderComponent from "./providers/query-provider.tsx";
import AppRoutes from "./routes.tsx";

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
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppRoutes />
      </ThemeProvider>
    </Router>
    <Toaster />
    <ReactQueryDevtools initialIsOpen={true} />
  </QueryClientProviderComponent>
);

// main.tsx ou main.js

// if ("serviceWorker" in navigator && "PushManager" in window) {
//   window.addEventListener("load", async () => {
//     try {
//       const registration = await navigator.serviceWorker.register("/service-worker.js");

//       console.log("Service Worker registered with scope:", registration.scope);

//       // Solicita permissão para enviar notificações
//       const permission = await Notification.requestPermission();
//       if (permission === "granted") {
//         console.log("Permissão concedida para notificações.");

//         // Subscribe ao Push Manager
//         const subscription = await registration.pushManager.subscribe({
//           userVisibleOnly: true, // A notificação sempre será visível para o usuário
//           applicationServerKey: "YOUR_PUBLIC_VAPID_KEY", // Substitua pela sua chave pública VAPID
//         });

//         console.log("Push subscription:", JSON.stringify(subscription));
//         // Envie a assinatura para o servidor, que será usada para enviar notificações push.
//       } else {
//         console.log("Permissão para notificações não foi concedida.");
//       }
//     } catch (error) {
//       console.error("Falha ao registrar o Service Worker ou Push Manager:", error);
//     }
//   });
// }
