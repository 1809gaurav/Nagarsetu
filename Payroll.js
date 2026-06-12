import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayrolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const fetchPayrolls = async () => {
    try {
      const response = await api.get('/payroll', {
        params: { month, year }
      });
      setPayrolls(response.data);
    } catch (error) {
      console.error('Failed to fetch payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading payroll...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Payroll Records</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: 'auto' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: 'auto' }}>
              {[2023, 2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Gross Salary</th>
              <th>Net Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll) => (
              <tr key={payroll._id}>
                <td>{payroll.employee?.name || 'N/A'}</td>
                <td>{new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</td>
                <td>₹{payroll.basicSalary?.toLocaleString() || 0}</td>
                <td>₹{(payroll.allowances?.hra || 0) + (payroll.allowances?.transport || 0) + (payroll.allowances?.medical || 0)}</td>
                <td>₹{(payroll.deductions?.tax || 0) + (payroll.deductions?.pf || 0)}</td>
                <td>₹{payroll.grossSalary?.toLocaleString() || 0}</td>
                <td><strong>₹{payroll.netSalary?.toLocaleString() || 0}</strong></td>
                <td>
                  <span className={`badge badge-${payroll.status === 'Paid' ? 'success' : payroll.status === 'Processed' ? 'info' : 'warning'}`}>
                    {payroll.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;


