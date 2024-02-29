import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import Home from './routes/Home.jsx';
import Perfil from './routes/Perfil.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Colab from './routes/Colaborador.jsx';
import Login from './routes/Login.jsx';

const router = createBrowserRouter([
  {
    path: '/login', element: <Login/>
  },
  {
    path: '/', element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '/', element: <Home/>
      },
      {
        path: 'perfil', element: <Perfil/>
      },
      {
        path: '/colab/:id', element: <Colab/>
      },
      {
        path: 'oldpage', element: <Navigate to='/perfil'/>
      }
    ] 
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
