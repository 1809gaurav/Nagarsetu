import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiEye } from 'react-icons/fi';

const Recruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    designation: '',
    vacancies: '',
    description: '',
    requirements: '',
    salaryRange: { min: '', max: '' },
    closingDate: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/recruitment');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
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
      const data = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()),
        salaryRange: {
          min: parseInt(formData.salaryRange.min),
          max: parseInt(formData.salaryRange.max)
        }
      };
      await api.post('/recruitment', data);
      setShowModal(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create job posting');
    }
  };

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      department: '',
      designation: '',
      vacancies: '',
      description: '',
      requirements: '',
      salaryRange: { min: '', max: '' },
      closingDate: ''
    });
  };

  if (loading) return <div className="loading">Loading job postings...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Job Postings</h2>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); resetForm(); }}>
            <FiPlus /> Post New Job
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Vacancies</th>
              <th>Applications</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.jobTitle}</td>
                <td>{job.department?.name || 'N/A'}</td>
                <td>{job.designation}</td>
                <td>{job.vacancies}</td>
                <td>{job.applications?.length || 0}</td>
                <td>
                  <span className={`badge badge-${job.status === 'Open' ? 'success' : 'warning'}`}>
                    {job.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => setSelectedJob(job)}>
                    <FiEye /> View
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
            <h3>Post New Job</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title</label>
                <input type="text" className="form-control" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select className="form-control" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required>
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" className="form-control" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Vacancies</label>
                <input type="number" className="form-control" value={formData.vacancies} onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" />
              </div>
              <div className="form-group">
                <label>Requirements (comma-separated)</label>
                <input type="text" className="form-control" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Min Salary</label>
                  <input type="number" className="form-control" value={formData.salaryRange.min} onChange={(e) => setFormData({ ...formData, salaryRange: { ...formData.salaryRange, min: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label>Max Salary</label>
                  <input type="number" className="form-control" value={formData.salaryRange.max} onChange={(e) => setFormData({ ...formData, salaryRange: { ...formData.salaryRange, max: e.target.value } })} />
                </div>
              </div>
              <div className="form-group">
                <label>Closing Date</label>
                <input type="date" className="form-control" value={formData.closingDate} onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Post Job</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h3>{selectedJob.jobTitle}</h3>
            <p><strong>Department:</strong> {selectedJob.department?.name}</p>
            <p><strong>Designation:</strong> {selectedJob.designation}</p>
            <p><strong>Vacancies:</strong> {selectedJob.vacancies}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <h4 style={{ marginTop: '1rem' }}>Applications ({selectedJob.applications?.length || 0})</h4>
            {selectedJob.applications?.length > 0 ? (
              <table className="table" style={{ marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJob.applications.map((app, idx) => (
                    <tr key={idx}>
                      <td>{app.applicantName}</td>
                      <td>{app.email}</td>
                      <td><span className={`badge badge-${app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No applications yet</p>
            )}
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setSelectedJob(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;


