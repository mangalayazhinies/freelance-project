import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'


function Projects() {

  const [projects,     setProjects]     = useState([])
  const [clients,      setClients]      = useState([])  // for the client dropdown
  const [loading,      setLoading]      = useState(true)
  const [showForm,     setShowForm]     = useState(false)
  const [editProject,  setEditProject]  = useState(null)
  const [saving,       setSaving]       = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', clientId: '', status: 'PLANNED', deadline: '', budget: ''
  })

  useEffect(() => {
    loadProjects()
    loadClients()
  }, [])

  function loadProjects() {
    api.get('/projects').then(res => setProjects(res.data)).catch(() => alert('Failed to load projects'))
  }

  function loadClients() {
    api.get('/clients').then(res => {
      setClients(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  // When any form input changes, update the form state
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function openAdd() {
    setEditProject(null)
    setForm({ name: '', description: '', clientId: '', status: 'PLANNED', deadline: '', budget: '' })
    setShowForm(true)
  }

  function openEdit(project) {
    setEditProject(project)
    setForm({
      name:        project.name        || '',
      description: project.description || '',
      clientId:    project.client?.id  || '',
      status:      project.status      || 'PLANNED',
      deadline:    project.deadline    || '',
      budget:      project.budget      || '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editProject) {
        await api.put('/projects/' + editProject.id, form)
      } else {
        await api.post('/projects', form)
      }
      setShowForm(false)
      loadProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving project')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return
    await api.delete('/projects/' + id)
    loadProjects()
  }

  function getStatusStyle(status) {
    if (status === 'IN_PROGRESS') return { backgroundColor: '#dbeafe', color: '#1d4ed8' }
    if (status === 'COMPLETED')   return { backgroundColor: '#dcfce7', color: '#15803d' }
    if (status === 'ON_HOLD')     return { backgroundColor: '#fef9c3', color: '#a16207' }
    return { backgroundColor: '#f3f4f6', color: '#374151' }  // PLANNED (default)
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
            <h1 style={{ marginBottom: '3px' }}>Projects</h1>
            <p style={{ color: '#777', fontSize: '13px' }}>{projects.length} project(s)</p>
          </div>
          <button
            onClick={openAdd}
            disabled={clients.length === 0}
            title={clients.length === 0 ? 'Add a client first' : ''}
            style={{ padding: '10px 20px', backgroundColor: clients.length === 0 ? '#ccc' : '#4f86f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: clients.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            + New Project
          </button>
        </div>

        {clients.length === 0 && !loading && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px', marginBottom: '15px', color: '#92400e', fontSize: '13px' }}>
            Please add a client first before creating a project.
          </div>
        )}

        {loading && <p style={{ color: '#777' }}>Loading...</p>}

        {/* Empty state */}
        {projects.length === 0 && !loading && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#aaa' }}>
            No projects yet.
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {projects.map(project => (
            <div key={project.id} style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '20px', width: '300px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', margin: 0 }}>{project.name}</h3>
                <span style={{ ...getStatusStyle(project.status), padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {project.status}
                </span>
              </div>

              <p style={{ color: '#4f86f7', fontSize: '12px', marginBottom: '8px' }}>
                👤 {project.client?.name}
              </p>

              {project.description && (
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>{project.description}</p>
              )}

              {/* Deadline and budget */}
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                {project.deadline && <p>📅 Deadline: {project.deadline}</p>}
                {project.budget   && <p>💰 Budget: ${project.budget}</p>}
              </div>

              {/* Edit and Delete buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                <button
                  onClick={() => openEdit(project)}
                  style={{ flex: 1, padding: '7px', backgroundColor: '#e8f0fe', color: '#3b5fc9', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{ flex: 1, padding: '7px', backgroundColor: '#fde8e8', color: '#c00', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div
            onClick={() => setShowForm(false)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', width: '450px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <h2 style={{ marginBottom: '20px' }}>{editProject ? 'Edit Project' : 'New Project'}</h2>

              <form onSubmit={handleSubmit}>

                <label style={labelStyle}>Project Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Client *</label>
                <select name="clientId" value={form.clientId} onChange={handleChange} required style={inputStyle}>
                  <option value="">-- Select Client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'none' }} />

                <label style={labelStyle}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <label style={labelStyle}>Deadline</label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Budget ($)</label>
                <input name="budget" type="number" value={form.budget} onChange={handleChange} style={inputStyle} />

                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                  <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', backgroundColor: saving ? '#aaa' : '#4f86f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {saving ? 'Saving...' : editProject ? 'Update' : 'Create'}
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

export default Projects
