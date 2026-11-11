import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'

function Tasks() {

  const [tasks,     setTasks]     = useState([])
  const [projects,  setProjects]  = useState([])  // for the project dropdown
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editTask,  setEditTask]  = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', projectId: '', status: 'TODO', dueDate: ''
  })

  useEffect(() => {
    loadTasks()
    loadProjects()
  }, [])

  function loadTasks() {
    api.get('/tasks').then(res => setTasks(res.data)).catch(() => alert('Failed to load tasks'))
  }

  function loadProjects() {
    api.get('/projects').then(res => {
      setProjects(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function openAdd() {
    setEditTask(null)
    setForm({ title: '', description: '', projectId: '', status: 'TODO', dueDate: '' })
    setShowForm(true)
  }

  function openEdit(task) {
    setEditTask(task)
    setForm({
      title:       task.title       || '',
      description: task.description || '',
      projectId:   task.project?.id || '',
      status:      task.status      || 'TODO',
      dueDate:     task.dueDate     || '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editTask) {
        await api.put('/tasks/' + editTask.id, form)
      } else {
        await api.post('/tasks', form)
      }
      setShowForm(false)
      loadTasks()   
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving task')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    await api.delete('/tasks/' + id)
    loadTasks()
  }


  async function changeStatus(task, newStatus) {
    try {
      await api.put('/tasks/' + task.id, { status: newStatus })
      loadTasks()   
    } catch {
      alert('Could not update status')
    }
  }

  function getStatusStyle(status) {
    if (status === 'IN_PROGRESS') return { backgroundColor: '#dbeafe', color: '#1d4ed8' }
    if (status === 'DONE')        return { backgroundColor: '#dcfce7', color: '#15803d' }
    return { backgroundColor: '#f3f4f6', color: '#374151' }  // TODO (default)
  }

  function getStatusLabel(status) {
    if (status === 'IN_PROGRESS') return 'In Progress'
    if (status === 'DONE')        return 'Done'
    return 'To Do'
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
            <h1 style={{ marginBottom: '3px' }}>Tasks</h1>
            <p style={{ color: '#777', fontSize: '13px' }}>{tasks.length} task(s) total</p>
          </div>
          <button
            onClick={openAdd}
            disabled={projects.length === 0}
            title={projects.length === 0 ? 'Add a project first' : ''}
            style={{ padding: '10px 20px', backgroundColor: projects.length === 0 ? '#ccc' : '#4f86f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: projects.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            + New Task
          </button>
        </div>

        {projects.length === 0 && !loading && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px', marginBottom: '15px', color: '#92400e', fontSize: '13px' }}>
            Create a project first before adding tasks.
          </div>
        )}

        {loading && <p style={{ color: '#777' }}>Loading...</p>}

        {tasks.length === 0 && !loading && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#aaa' }}>
            No tasks yet.
          </div>
        )}

        {tasks.length > 0 && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
            {tasks.map((task, index) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderBottom: index < tasks.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >

                <div style={{ flex: 1 }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{task.title}</span>
                    <span style={{
                      ...getStatusStyle(task.status),
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#999' }}>
                    <span style={{ color: '#4f86f7' }}>📁 {task.project?.name}</span>
                    {task.dueDate    && <span>📅 {task.dueDate}</span>}
                    {task.description && <span>{task.description}</span>}
                  </div>
                </div>

                <select
                  value={task.status}
                  onChange={e => changeStatus(task, e.target.value)}
                  style={{ padding: '5px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>

                <button
                  onClick={() => openEdit(task)}
                  style={{ padding: '5px 12px', backgroundColor: '#e8f0fe', color: '#3b5fc9', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  style={{ padding: '5px 12px', backgroundColor: '#fde8e8', color: '#c00', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                >
                  Delete
                </button>

              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Form Modal */}
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
              style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', width: '430px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <h2 style={{ marginBottom: '20px' }}>
                {editTask ? 'Edit Task' : 'New Task'}
              </h2>

              <form onSubmit={handleSubmit}>

                <label style={labelStyle}>Task Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />

                <label style={labelStyle}>Project *</label>
                <select name="projectId" value={form.projectId} onChange={handleChange} required style={inputStyle}>
                  <option value="">-- Select Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <label style={labelStyle}>Description</label>
                <input name="description" value={form.description} onChange={handleChange} style={inputStyle} />

                <label style={labelStyle}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>

                <label style={labelStyle}>Due Date</label>
                <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} style={inputStyle} />

                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', backgroundColor: saving ? '#aaa' : '#4f86f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {saving ? 'Saving...' : editTask ? 'Update' : 'Create'}
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

export default Tasks
