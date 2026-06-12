import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Transfers = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    toDepartment: '',
    reason: ''
  });

  useEffect(() => {
    fetchTransfers();
    fetchDepartments();
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await api.get('/transfers');
      setTransfers(response.data);
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transfers', formData);
      setShowModal(false);
      resetForm();
      fetchTransfers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit transfer request');
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/transfers/${id}/approve`, { status, remarks: status === 'Approved' ? 'Approved' : 'Rejected' });
      fetchTransfers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update transfer status');
    }
  };

  const resetForm = () => {
    setFormData({
      toDepartment: '',
      reason: ''
    });
  };

  if (loading) return <div className="loading">Loading transfer requests...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Transfer Requests</h2>
          {user?.role === 'Employee' && (
            <button className="btn btn-primary" onClick={() => { setShowModal(true); resetForm(); }}>
              <FiPlus /> Request Transfer
            </button>
          )}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>From Department</th>
              <th>To Department</th>
              <th>Reason</th>
              <th>Requested Date</th>
              <th>Status</th>
              {(user?.role === 'Admin' || user?.role === 'HR Officer') && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer._id}>
                <td>{transfer.employee?.name || 'N/A'}</td>
                <td>{transfer.fromDepartment?.name || 'N/A'}</td>
                <td>{transfer.toDepartment?.name || 'N/A'}</td>
                <td>{transfer.reason}</td>
                <td>{new Date(transfer.requestedDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${transfer.status === 'Approved' ? 'success' : transfer.status === 'Rejected' ? 'danger' : 'warning'}`}>
                    {transfer.status}
                  </span>
                </td>
                {(user?.role === 'Admin' || user?.role === 'HR Officer') && transfer.status === 'Pending' && (
                  <td>
                    <button className="btn btn-success" style={{ marginRight: '0.5rem' }} onClick={() => handleApprove(transfer._id, 'Approved')}>
                      <FiCheck /> Approve
                    </button>
                    <button className="btn btn-danger" onClick={() => handleApprove(transfer._id, 'Rejected')}>
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
            <h3>Request Transfer</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>To Department</label>
                <select className="form-control" value={formData.toDepartment} onChange={(e) => setFormData({ ...formData, toDepartment: e.target.value })} required>
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
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

export default Transfers;


