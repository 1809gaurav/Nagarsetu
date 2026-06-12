import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiMessageSquare, FiX, FiSend, FiClock, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Grievances.css';

const Grievances = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [newUpdate, setNewUpdate] = useState('');
  const [addingUpdate, setAddingUpdate] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchGrievances();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const fetchGrievances = async () => {
    try {
      const response = await api.get('/grievances');
      setGrievances(response.data);
    } catch (error) {
      console.error('Failed to fetch grievances:', error);
      showNotification('error', 'Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrievanceDetails = async (id) => {
    try {
      const response = await api.get(`/grievances/${id}`);
      setSelectedGrievance(response.data);
    } catch (error) {
      console.error('Failed to fetch grievance details:', error);
      showNotification('error', 'Failed to load grievance details');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.subject || formData.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the form errors');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/grievances', formData);
      showNotification('success', `Grievance submitted successfully! Ticket #: ${response.data.ticketNumber}`);
      setShowModal(false);
      resetForm();
      fetchGrievances();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status, resolution) => {
    try {
      await api.put(`/grievances/${id}/status`, { status, resolution });
      showNotification('success', 'Grievance status updated successfully');
      fetchGrievances();
      if (selectedGrievance?._id === id) {
        fetchGrievanceDetails(id);
      }
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to update grievance status');
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.trim()) {
      showNotification('error', 'Please enter an update');
      return;
    }

    setAddingUpdate(true);
    try {
      await api.post(`/grievances/${selectedGrievance._id}/updates`, { update: newUpdate });
      showNotification('success', 'Update added successfully');
      setNewUpdate('');
      fetchGrievanceDetails(selectedGrievance._id);
      fetchGrievances();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to add update');
    } finally {
      setAddingUpdate(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      subject: '',
      description: '',
      priority: 'Medium'
    });
    setFormErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading grievances...</div>;

  return (
    <div>
      {notification.message && (
        <div className={notification.type === 'success' ? 'success' : 'error'}>
          {notification.message}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Grievances</h2>
          {user?.role === 'Employee' && (
            <button className="btn btn-primary" onClick={() => { setShowModal(true); resetForm(); }}>
              <FiPlus /> Raise Grievance
            </button>
          )}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Employee</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((grievance) => (
              <tr key={grievance._id}>
                <td>{grievance.ticketNumber}</td>
                <td>{grievance.employee?.name || 'N/A'}</td>
                <td>{grievance.category}</td>
                <td>{grievance.subject}</td>
                <td>
                  <span className={`badge badge-${grievance.priority === 'Critical' ? 'danger' : grievance.priority === 'High' ? 'warning' : 'info'}`}>
                    {grievance.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${grievance.status === 'Resolved' ? 'success' : grievance.status === 'Open' ? 'info' : 'warning'}`}>
                    {grievance.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => fetchGrievanceDetails(grievance._id)}>
                    <FiMessageSquare /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Raise Grievance</h3>
              <button 
                className="btn btn-secondary" 
                onClick={() => { setShowModal(false); resetForm(); }}
                style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category <span style={{ color: 'red' }}>*</span></label>
                <select 
                  className={`form-control ${formErrors.category ? 'error-input' : ''}`}
                  value={formData.category} 
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (formErrors.category) {
                      setFormErrors({ ...formErrors, category: '' });
                    }
                  }}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Salary">Salary</option>
                  <option value="Leave">Leave</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.category && <span className="error-text">{formErrors.category}</span>}
              </div>
              <div className="form-group">
                <label>Subject <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  className={`form-control ${formErrors.subject ? 'error-input' : ''}`}
                  value={formData.subject} 
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (formErrors.subject) {
                      setFormErrors({ ...formErrors, subject: '' });
                    }
                  }}
                  placeholder="Brief description of your grievance"
                  required 
                />
                {formErrors.subject && <span className="error-text">{formErrors.subject}</span>}
              </div>
              <div className="form-group">
                <label>Description <span style={{ color: 'red' }}>*</span></label>
                <textarea 
                  className={`form-control ${formErrors.description ? 'error-input' : ''}`}
                  value={formData.description} 
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formErrors.description) {
                      setFormErrors({ ...formErrors, description: '' });
                    }
                  }}
                  rows="5"
                  placeholder="Provide detailed information about your grievance..."
                  required 
                />
                {formErrors.description && <span className="error-text">{formErrors.description}</span>}
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select 
                  className="form-control" 
                  value={formData.priority} 
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Grievance'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setShowModal(false); resetForm(); }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGrievance && (
        <div className="modal-overlay" onClick={() => setSelectedGrievance(null)}>
          <div className="modal-content grievance-details-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Grievance Details - {selectedGrievance.ticketNumber}</h3>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedGrievance(null)}
                style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
              >
                <FiX />
              </button>
            </div>
            
            <div className="grievance-details-grid">
              <div className="detail-item">
                <strong>Employee:</strong> {selectedGrievance.employee?.name} ({selectedGrievance.employee?.employeeId})
              </div>
              <div className="detail-item">
                <strong>Category:</strong> {selectedGrievance.category}
              </div>
              <div className="detail-item">
                <strong>Subject:</strong> {selectedGrievance.subject}
              </div>
              <div className="detail-item">
                <strong>Priority:</strong> 
                <span className={`badge badge-${selectedGrievance.priority === 'Critical' ? 'danger' : selectedGrievance.priority === 'High' ? 'warning' : 'info'}`}>
                  {selectedGrievance.priority}
                </span>
              </div>
              <div className="detail-item">
                <strong>Status:</strong> 
                <span className={`badge badge-${selectedGrievance.status === 'Resolved' ? 'success' : selectedGrievance.status === 'Open' ? 'info' : 'warning'}`}>
                  {selectedGrievance.status}
                </span>
              </div>
              <div className="detail-item">
                <strong>Created:</strong> {formatDate(selectedGrievance.createdAt)}
              </div>
              {selectedGrievance.assignedTo && (
                <div className="detail-item">
                  <strong>Assigned To:</strong> {selectedGrievance.assignedTo?.name}
                </div>
              )}
              {selectedGrievance.resolvedDate && (
                <div className="detail-item">
                  <strong>Resolved On:</strong> {formatDate(selectedGrievance.resolvedDate)}
                </div>
              )}
            </div>

            <div className="detail-section">
              <strong>Description:</strong>
              <p style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--light-bg)', borderRadius: '4px' }}>
                {selectedGrievance.description}
              </p>
            </div>

            {selectedGrievance.resolution && (
              <div className="detail-section">
                <strong>Resolution:</strong>
                <p style={{ marginTop: '0.5rem', padding: '1rem', background: '#d1fae5', borderRadius: '4px', color: '#065f46' }}>
                  {selectedGrievance.resolution}
                </p>
              </div>
            )}

            {/* Updates/Comments Section */}
            <div className="detail-section">
              <strong>Updates & Comments:</strong>
              <div className="updates-container">
                {selectedGrievance.updates && selectedGrievance.updates.length > 0 ? (
                  selectedGrievance.updates.map((update, index) => (
                    <div key={index} className="update-item">
                      <div className="update-header">
                        <span><FiUser /> {update.updatedBy?.name || 'System'}</span>
                        <span><FiClock /> {formatDate(update.date)}</span>
                      </div>
                      <div className="update-content">{update.update}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No updates yet</p>
                )}
              </div>

              {/* Add Update Form */}
              {(user?.role === 'Employee' || user?.role === 'Admin' || user?.role === 'HR Officer' || selectedGrievance.assignedTo?._id === user?.employeeId) && (
                <form onSubmit={handleAddUpdate} style={{ marginTop: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <textarea
                      className="form-control"
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                      rows="3"
                      placeholder="Add an update or comment..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={addingUpdate || !newUpdate.trim()}>
                    <FiSend /> {addingUpdate ? 'Adding...' : 'Add Update'}
                  </button>
                </form>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {(user?.role === 'Admin' || user?.role === 'HR Officer') && selectedGrievance.status !== 'Resolved' && selectedGrievance.status !== 'Closed' && (
                <>
                  <button 
                    className="btn btn-success" 
                    onClick={() => {
                      const resolution = prompt('Enter resolution details:');
                      if (resolution) {
                        handleStatusUpdate(selectedGrievance._id, 'Resolved', resolution);
                      }
                    }}
                  >
                    Mark as Resolved
                  </button>
                  <button 
                    className="btn btn-warning" 
                    onClick={() => handleStatusUpdate(selectedGrievance._id, 'In Progress', '')}
                  >
                    Mark as In Progress
                  </button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedGrievance(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grievances;


