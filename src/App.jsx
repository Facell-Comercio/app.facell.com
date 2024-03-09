import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";


function App() {
  return (
    <div className="app flex h-full w-full overflow-hidden">
      <Sidebar/>
      <div className="h-full w-full flex flex-col overflow-auto">
        <Navbar />
        <div className="flex-1 w-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
