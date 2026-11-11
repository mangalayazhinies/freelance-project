import { Link, useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation() 

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function getLinkStyle(path) {
    const base = {
      display: 'block',
      padding: '10px 15px',
      marginBottom: '5px',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '14px',
      color: location.pathname === path ? '#fff' : '#333',
      backgroundColor: location.pathname === path ? '#4f86f7' : 'transparent',
    }
    return base
  }

  return (
    <div style={{
      width: '200px',
      minHeight: '100vh',
      backgroundColor: '#fff',
      borderRight: '1px solid #ddd',
      padding: '15px',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>

      <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
        <h2 style={{ color: '#4f86f7', fontSize: '16px', marginBottom: '5px' }}>📋 Freelance App</h2>
        {user && <p style={{ fontSize: '12px', color: '#777' }}>Hi, {user.name}!</p>}
      </div>

      <nav style={{ flex: 1 }}>
        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>Dashboard</Link>
        <Link to="/clients"   style={getLinkStyle('/clients')}>Clients</Link>
        <Link to="/projects"  style={getLinkStyle('/projects')}>📁 Projects</Link>
        <Link to="/tasks"     style={getLinkStyle('/tasks')}>✅ Tasks</Link>
      </nav>

      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#fff',
          border: '1px solid #f44',
          borderRadius: '6px',
          color: '#f44',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
        }}
      >
        Logout
      </button>

    </div>
  )
}

export default Navbar
