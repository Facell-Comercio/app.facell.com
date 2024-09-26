import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/sidebar/Sidebar";
import { useAuthStore } from "./context/auth-store";
import { urlB64ToUint8Array } from "./helpers/format";
import { api } from "./lib/axios";

navigator.serviceWorker.register("/service-worker.js").then(async (serviceWorker) => {
  let subscription = await serviceWorker.pushManager.getSubscription();
  const user = useAuthStore.getState().user;
  if (!subscription) {
    const publicKeyResponse = await api.get("/notification/public-key").then((res) => res.data);
    const applicationServerKey = urlB64ToUint8Array(publicKeyResponse);
    subscription = await serviceWorker.pushManager.subscribe({
      applicationServerKey,
      userVisibleOnly: true,
    });
  }

  await api.post("/notification/register", { subscription, user });
});

function App() {
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
