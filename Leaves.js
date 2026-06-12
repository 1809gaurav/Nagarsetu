import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leaves');
      setLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', formData);
      setShowModal(false);
      resetForm();
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/approve`, { status, remarks: status === 'Approved' ? 'Approved' : 'Rejected' });
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update leave status');
    }
  };

  const resetForm = () => {
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  if (loading) return <div className="loading">Loading leave requests...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Leave Requests</h2>
          {user?.role === 'Employee' && (
            <button className="btn btn-primary" onClick={() => { setShowModal(true); resetForm(); }}>
              <FiPlus /> Request Leave
            </button>
          )}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              {(user?.role === 'Admin' || user?.role === 'HR Officer' || user?.role === 'Department Head') && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.employee?.name || 'N/A'}</td>
                <td>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={`badge badge-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}`}>
                    {leave.status}
                  </span>
                </td>
                {(user?.role === 'Admin' || user?.role === 'HR Officer' || user?.role === 'Department Head') && leave.status === 'Pending' && (
                  <td>
                    <button className="btn btn-success" style={{ marginRight: '0.5rem' }} onClick={() => handleApprove(leave._id, 'Approved')}>
                      <FiCheck /> Approve
                    </button>
                    <button className="btn btn-danger" onClick={() => handleApprove(leave._id, 'Rejected')}>
                      <FiX /> Reject
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Request Leave</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Leave Type</label>
                <select className="form-control" value={formData.leaveType} onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })} required>
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Compensatory Off">Compensatory Off</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" className="form-control" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" className="form-control" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea className="form-control" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} rows="3" required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;


