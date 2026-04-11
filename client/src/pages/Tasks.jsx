import { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiClock, FiPlay, FiTrash2, FiX, FiFlag, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Tasks.css';

const priorityColors = { low: 'cyan', medium: 'warning', high: 'error' };
const statusConfig = {
  pending: { label: 'To Do', icon: <FiClock size={14} />, color: 'var(--text-tertiary)' },
  in_progress: { label: 'In Progress', icon: <FiPlay size={14} />, color: 'var(--warning)' },
  completed: { label: 'Done', icon: <FiCheck size={14} />, color: 'var(--success)' },
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, in_progress: 0, completed: 0, total: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/tasks/stats'),
      ]);
      setTasks(tasksRes.data.data.tasks);
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.dueDate) delete payload.dueDate;
      await api.post('/tasks', payload);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
      toast.success('Task created');
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchAll();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const nextStatus = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="tasks-page">
      <div className="container">
        <div className="tasks-header animate-fade-up">
          <div>
            <h1>Tasks</h1>
            <p>{stats.total} total tasks</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <FiPlus size={16} /> New Task
          </button>
        </div>

        {/* Stats */}
        <div className="task-stats animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <button className={`task-stat ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            <span className="task-stat-value">{stats.total}</span>
            <span className="task-stat-label">All</span>
          </button>
          <button className={`task-stat ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
            <span className="task-stat-value">{stats.pending}</span>
            <span className="task-stat-label">To Do</span>
          </button>
          <button className={`task-stat ${filter === 'in_progress' ? 'active' : ''}`} onClick={() => setFilter('in_progress')}>
            <span className="task-stat-value">{stats.in_progress}</span>
            <span className="task-stat-label">In Progress</span>
          </button>
          <button className={`task-stat ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
            <span className="task-stat-value">{stats.completed}</span>
            <span className="task-stat-label">Done</span>
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="tasks-empty animate-fade-up">
            <FiCheck size={40} />
            <h3>{filter === 'all' ? 'No tasks yet' : `No ${statusConfig[filter]?.label || ''} tasks`}</h3>
            <p>Create your first task to get started</p>
          </div>
        ) : (
          <div className="task-list">
            {filtered.map((task, i) => {
              const sc = statusConfig[task.status];
              return (
                <div key={task._id} className={`task-item ${task.status}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <button
                    className={`task-status-btn ${task.status}`}
                    onClick={() => handleStatusChange(task._id, nextStatus[task.status])}
                    title={`Move to ${statusConfig[nextStatus[task.status]].label}`}
                  >
                    {sc.icon}
                  </button>
                  <div className="task-content">
                    <span className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>{task.title}</span>
                    {task.description && <span className="task-desc">{task.description}</span>}
                    <div className="task-meta">
                      <span className={`task-priority ${priorityColors[task.priority]}`}>
                        <FiFlag size={11} /> {task.priority}
                      </span>
                      <span className="task-status-label" style={{ color: sc.color }}>{sc.label}</span>
                      {task.dueDate && (
                        <span className="task-due"><FiCalendar size={11} /> {formatDate(task.dueDate)}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(task._id)} className="task-delete" title="Delete">
                    <FiTrash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>New Task</h2>
                <button onClick={() => setShowForm(false)} className="modal-close"><FiX size={20} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="What needs to be done?"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Add details..."
                    rows={3}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Task'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
