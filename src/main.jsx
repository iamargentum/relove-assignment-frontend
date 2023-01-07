import './index.css'
import React from 'react'
import { MathApp } from './routes/app'
import ReactDOM from 'react-dom/client'
import { LoginView } from './routes/login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>hi! nothing much to see here :)</h1>
  },
  {
    path: "/login",
    element: <LoginView />
  },
  {
    path: "/app",
    element: <MathApp />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)