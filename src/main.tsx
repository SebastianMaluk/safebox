import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './routes/Root.tsx'
import Admin from './routes/Admin.tsx'
import User from './routes/User.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/about',
    element: <div>About</div>
  },
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '/user',
    element: <User />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
