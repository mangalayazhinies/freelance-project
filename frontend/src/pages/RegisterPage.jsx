import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

function RegisterPage() {

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/register', { name, email, password })
      const data = response.data

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }))

      navigate('/dashboard')

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  }

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '35px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    width: '350px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginTop: '5px',
    marginBottom: '15px',
    fontSize: '14px',
  }

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#555',
  }

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: loading ? '#aaa' : '#4f86f7',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        <h2 style={{ marginBottom: '5px' }}>Create Account</h2>
        <p style={{ color: '#777', marginBottom: '20px', fontSize: '13px' }}>Fill in your details to register</p>

        {error && (
          <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5a', borderRadius: '6px', padding: '10px', marginBottom: '15px', color: '#c00', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            style={inputStyle}
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@email.com"
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="At least 6 characters"
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#777' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f86f7' }}>Sign In</Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage
