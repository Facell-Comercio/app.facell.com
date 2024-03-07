import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";


function App() {
  return (
    <div className="app flex h-screen w-screen overflow-hidden">
      <Sidebar/>
      <div className="flex flex-col flex-1 overflow-auto">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
