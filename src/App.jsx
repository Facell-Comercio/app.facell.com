import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";


function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="sidebar">Sidebar</div>
      <Outlet />
    </div>
  );
}

export default App;
