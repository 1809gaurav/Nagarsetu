import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    totalPositions: '',
    head: ''
  });

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
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
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      setShowModal(false);
      setEditingDept(null);
      resetForm();
      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save department');
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      location: dept.location || '',
      totalPositions: dept.totalPositions || '',
      head: dept.head?._id || dept.head || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete department');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      location: '',
      totalPositions: '',
      head: ''
    });
  };

  if (loading) return <div className="loading">Loading departments...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Departments</h2>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditingDept(null); resetForm(); }}>
            <FiPlus /> Add Department
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Location</th>
              <th>Head</th>
              <th>Positions</th>
              <th>Filled</th>
              <th>Vacancies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.code}</td>
                <td>{dept.name}</td>
                <td>{dept.location || 'N/A'}</td>
                <td>{dept.head?.name || 'N/A'}</td>
                <td>{dept.totalPositions}</td>
                <td>{dept.filledPositions}</td>
                <td>{dept.totalPositions - dept.filledPositions}</td>
                <td>
                  <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(dept)}>
                    <FiEdit />
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(dept._id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingDept(null); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingDept ? 'Edit Department' : 'Add Department'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Total Positions</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.totalPositions}
                  onChange={(e) => setFormData({ ...formData, totalPositions: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Department Head</label>
                <select
                  className="form-control"
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                >
                  <option value="">Select Head</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingDept(null); resetForm(); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;


