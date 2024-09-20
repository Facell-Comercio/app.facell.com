import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/sidebar/Sidebar";

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
