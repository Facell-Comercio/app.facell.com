import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/sidebar/Sidebar";
import { useAuthStore } from "./context/auth-store";
import { urlB64ToUint8Array } from "./helpers/format";
import { api } from "./lib/axios";

//* Registra o service worker se o navegador tiver suporte
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(`/service-worker.js?v=1.0.0`).then((serviceWorker) => {
      serviceWorker.update().then((value) => console.log(value));
      const user = useAuthStore.getState().user;
      serviceWorker.pushManager.getSubscription().then(async (subscription) => {
        if (!subscription) {
          const publicKeyResponse = await api
            .get("/notification/public-key")
            .then((res) => res.data);
          const applicationServerKey = urlB64ToUint8Array(publicKeyResponse);
          subscription = await serviceWorker.pushManager.subscribe({
            applicationServerKey,
            userVisibleOnly: true,
          });
        }
        await api.post("/notification/register", { subscription, user });
      });
    });
  } else {
    console.warn("Service Workers não são suportados neste navegador.");
  }
}

//* Verifica se o usúario permite o envio de notificações
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.error("Este navegador não suporta notificações de desktop.");
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      registerServiceWorker();
    } else if (permission === "denied") {
      console.warn("Permissão negada para notificações.");
    }
  });
}

function App() {
  //* Solicitar permissão de notificações quando o componente for montado
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="app flex h-full w-full overflow-hidden">
      <Sidebar />
      <div className="h-full w-full flex flex-col overflow-auto">
        <Navbar />
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
