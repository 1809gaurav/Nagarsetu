import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Performance = () => {
  const { user } = useAuth();
  const [performances, setPerformances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee: '',
    reviewPeriod: { startDate: '', endDate: '' },
    kpis: [{ name: '', target: '', achieved: '', weight: '' }],
    strengths: '',
    areasForImprovement: '',
    remarks: ''
  });

  useEffect(() => {
    fetchPerformances();
    if (user?.role !== 'Employee') {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPerformances = async () => {
    try {
      const response = await api.get('/performance');
      setPerformances(response.data);
    } catch (error) {
      console.error('Failed to fetch performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        kpis: formData.kpis.map(kpi => ({
          name: kpi.name,
          target: parseFloat(kpi.target),
          achieved: parseFloat(kpi.achieved),
          weight: parseFloat(kpi.weight) || 1
        })),
        strengths: formData.strengths.split(',').map(s => s.trim()),
        areasForImprovement: formData.areasForImprovement.split(',').map(a => a.trim()),
        reviewPeriod: {
          startDate: new Date(formData.reviewPeriod.startDate),
          endDate: new Date(formData.reviewPeriod.endDate)
        }
      };
      await api.post('/performance', data);
      setShowModal(false);
      resetForm();
      fetchPerformances();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create performance review');
    }
  };

  const resetForm = () => {
    setFormData({
      employee: '',
      reviewPeriod: { startDate: '', endDate: '' },
      kpis: [{ name: '', target: '', achieved: '', weight: '' }],
      strengths: '',
      areasForImprovement: '',
      remarks: ''
    });
  };

  if (loading) return <div className="loading">Loading performance reviews...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Performance Reviews</h2>
          {(user?.role === 'Admin' || user?.role === 'HR Officer' || user?.role === 'Department Head') && (
            <button className="btn btn-primary" onClick={() => { setShowModal(true); resetForm(); }}>
              <FiPlus /> Add Review
            </button>
          )}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Review Period</th>
              <th>Overall Score</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {performances.map((perf) => (
              <tr key={perf._id}>
                <td>{perf.employee?.name || 'N/A'}</td>
                <td>
                  {perf.reviewPeriod?.startDate && perf.reviewPeriod?.endDate
                    ? `${new Date(perf.reviewPeriod.startDate).toLocaleDateString()} - ${new Date(perf.reviewPeriod.endDate).toLocaleDateString()}`
                    : 'N/A'}
                </td>
                <td>{perf.overallScore}%</td>
                <td>
                  <span className={`badge badge-${perf.rating === 'Excellent' ? 'success' : perf.rating === 'Good' ? 'info' : perf.rating === 'Poor' ? 'danger' : 'warning'}`}>
                    {perf.rating}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${perf.status === 'Approved' ? 'success' : 'warning'}`}>
                    {perf.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3>Add Performance Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee</label>
                <select className="form-control" value={formData.employee} onChange={(e) => setFormData({ ...formData, employee: e.target.value })} required>
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" className="form-control" value={formData.reviewPeriod.startDate} onChange={(e) => setFormData({ ...formData, reviewPeriod: { ...formData.reviewPeriod, startDate: e.target.value } })} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" className="form-control" value={formData.reviewPeriod.endDate} onChange={(e) => setFormData({ ...formData, reviewPeriod: { ...formData.reviewPeriod, endDate: e.target.value } })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Strengths (comma-separated)</label>
                <input type="text" className="form-control" value={formData.strengths} onChange={(e) => setFormData({ ...formData, strengths: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Areas for Improvement (comma-separated)</label>
                <input type="text" className="form-control" value={formData.areasForImprovement} onChange={(e) => setFormData({ ...formData, areasForImprovement: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Remarks</label>
                <textarea className="form-control" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} rows="3" />
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

export default Performance;


