import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api'


function Dashboard() {

  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(response => {
        setStats(response.data)   // save the numbers
        setLoading(false)
      })
      .catch(err => {
        setError('Could not load stats')
        setLoading(false)
      })
  }, [])  


  function StatCard({ emoji, label, value, borderColor }) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '2px solid ' + borderColor,
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        minWidth: '130px',
      }}>
        <div style={{ fontSize: '30px', marginBottom: '8px' }}>{emoji}</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</div>
        <div style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>{label}</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>

      <Navbar />

      <div style={{ marginLeft: '200px', padding: '30px', flex: 1 }}>

        <h1 style={{ marginBottom: '5px' }}>Dashboard</h1>
        <p style={{ color: '#777', marginBottom: '25px' }}>Welcome back! Here's your summary.</p>

        {loading && <p style={{ color: '#777' }}>Loading stats...</p>}
        {error   && <p style={{ color: 'red' }}>{error}</p>}

        {stats && (
          <>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
              <StatCard emoji="👤" label="Total Clients"   value={stats.totalClients}   borderColor="#b3cdfb" />
              <StatCard emoji="📁" label="Total Projects"  value={stats.totalProjects}  borderColor="#b3f5c8" />
              <StatCard emoji="⚡" label="Active Projects" value={stats.activeProjects} borderColor="#ffe0a0" />
              <StatCard emoji="✅" label="Tasks Done"      value={stats.doneTasks}      borderColor="#d9b3ff" />
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
              <StatCard emoji="📋" label="Total Tasks"   value={stats.totalTasks}      borderColor="#ddd" />
              <StatCard emoji="🕐" label="Pending Tasks" value={stats.pendingTasks}    borderColor="#ffc0a0" />
              <StatCard emoji="🔄" label="In Progress"   value={stats.inProgressTasks} borderColor="#b3c0ff" />
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '20px' }}>
              <h3 style={{ marginBottom: '12px', color: '#555' }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to="/clients"  style={{ padding: '8px 16px', backgroundColor: '#e8f0fe', color: '#3b5fc9', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>+ Add Client</Link>
                <Link to="/projects" style={{ padding: '8px 16px', backgroundColor: '#e6faf0', color: '#1a7a4a', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>+ New Project</Link>
                <Link to="/tasks"    style={{ padding: '8px 16px', backgroundColor: '#f3e8ff', color: '#6b2fa0', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>+ New Task</Link>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Dashboard
