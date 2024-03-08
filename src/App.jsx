import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";


function App() {
  return (
    <div className="app">
      <Sidebar/>
      <div className="root-content">
        <Navbar />
        <div className="root-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
