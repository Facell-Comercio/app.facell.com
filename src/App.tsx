import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Toaster } from "./components/ui/toaster";


function App() {
  return (
    <div className="app flex h-full w-full overflow-hidden">
      <Sidebar/>
      <div className="h-full w-full flex flex-col overflow-auto">
        <Navbar />
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
