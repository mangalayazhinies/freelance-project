import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'


function Clients() {

  const [clients,    setClients]    = useState([])    // list of clients
  const [loading,    setLoading]    = useState(true)   // loading state
  const [showForm,   setShowForm]   = useState(false)  // show/hide form modal
  const [editClient, setEditClient] = useState(null)   // null = adding new client
  const [saving,     setSaving]     = useState(false)  // show "Saving..." on button

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })

  useEffect(() => {
    loadClients()
  }, [])

  function loadClients() {
    api.get('/clients')
      .then(response => {
        setClients(response.data)
        setLoading(false)
      })
      .catch(() => {
        alert('Failed to load clients')
        setLoading(false)
      })
  }


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function openAddForm() {
    setEditClient(null)
    setForm({ name: '', email: '', phone: '', company: '' })
    setShowForm(true)
  }

  function openEditForm(client) {
    setEditClient(client)
    setForm({
      name:    client.name    || '',
      email:   client.email   || '',
      phone:   client.phone   || '',
      company: client.company || '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      if (editClient) {
        await api.put('/clients/' + editClient.id, form)
      } else {
        await api.post('/clients', form)
      }

      setShowForm(false)   
      loadClients()        

    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this client?')) return

    try {
      await api.delete('/clients/' + id)
      loadClients()    
    } catch (err) {
      alert('Could not delete client')
    }
  }

  const tableHeaderStyle = {
    textAlign: 'left',
    padding: '10px 15px',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#555',
  }

  const tableCellStyle = {
    padding: '10px 15px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '13px',
  }

  const inputStyle = {
    width: '100%',
    padding: '9px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginTop: '4px',
    marginBottom: '12px',
    fontSize: '14px',
  }

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#555',
  }

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />

      <div style={{ marginLeft: '200px', padding: '30px', flex: 1 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ marginBottom: '3px' }}>Clients</h1>
            <p style={{ color: '#777', fontSize: '13px' }}>{clients.length} client(s) total</p>
          </div>
          <button
            onClick={openAddForm}
            style={{ padding: '10px 20px', backgroundColor: '#4f86f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add Client
          </button>
        </div>

        {loading && <p style={{ color: '#777' }}>Loading...</p>}

        {clients.length === 0 && !loading && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#aaa' }}>
            No clients yet. Click "Add Client" to get started.
          </div>
        )}

        {clients.length > 0 && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Phone</th>
                  <th style={tableHeaderStyle}>Company</th>
                  <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>{client.name}</td>
                    <td style={tableCellStyle}>{client.email}</td>
                    <td style={tableCellStyle}>{client.phone || '—'}</td>
                    <td style={tableCellStyle}>{client.company || '—'}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                      <button
                        onClick={() => openEditForm(client)}
                        style={{ padding: '5px 12px', marginRight: '6px', backgroundColor: '#e8f0fe', color: '#3b5fc9', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        style={{ padding: '5px 12px', backgroundColor: '#fde8e8', color: '#c00', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {/* When showForm is true, we show a dark overlay + white form box */}
        {showForm && (
          <div
            onClick={() => setShowForm(false)}   // click outside the box → close form
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            {/* Stop click from bubbling up to the overlay (which would close the form) */}
            <div
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '25px',
                width: '400px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
              }}
            >
              <h2 style={{ marginBottom: '20px' }}>
                {editClient ? 'Edit Client' : 'Add New Client'}
              </h2>

              <form onSubmit={handleSubmit}>

                <label style={labelStyle}>Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Company</label>
                <input name="company" value={form.company} onChange={handleChange} style={inputStyle} />

                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ flex: 1, padding: '10px', backgroundColor: saving ? '#aaa' : '#4f86f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                  >
                    {saving ? 'Saving...' : editClient ? 'Update' : 'Add Client'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Clients
