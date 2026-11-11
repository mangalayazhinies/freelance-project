import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

       
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clients"   element={<PrivateRoute><Clients /></PrivateRoute>} />
        <Route path="/projects"  element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/tasks"     element={<PrivateRoute><Tasks /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
