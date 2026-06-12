import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendance();
    fetchTodayAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance', {
        params: { month, year }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date();
      const response = await api.get('/attendance', {
        params: {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        }
      });
      if (response.data.length > 0) {
        setTodayAttendance(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/checkin');
      fetchTodayAttendance();
      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout');
      fetchTodayAttendance();
      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to check out');
    }
  };

  if (loading) return <div className="loading">Loading attendance...</div>;

  return (
    <div>
      {user?.role === 'Employee' && (
        <div className="card">
          <div className="card-header">
            <h2>Today's Attendance</h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {!todayAttendance?.checkIn?.time ? (
              <button className="btn btn-primary" onClick={handleCheckIn}>
                <FiClock /> Check In
              </button>
            ) : (
              <div>
                <p><strong>Check In:</strong> {new Date(todayAttendance.checkIn.time).toLocaleTimeString()}</p>
                {!todayAttendance?.checkOut?.time ? (
                  <button className="btn btn-success" onClick={handleCheckOut} style={{ marginTop: '0.5rem' }}>
                    <FiCheckCircle /> Check Out
                  </button>
                ) : (
                  <p><strong>Check Out:</strong> {new Date(todayAttendance.checkOut.time).toLocaleTimeString()}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Attendance Records</h2>
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
              <th>Date</th>
              <th>Employee</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr key={att._id}>
                <td>{new Date(att.date).toLocaleDateString()}</td>
                <td>{att.employee?.name || 'N/A'}</td>
                <td>{att.checkIn?.time ? new Date(att.checkIn.time).toLocaleTimeString() : 'N/A'}</td>
                <td>{att.checkOut?.time ? new Date(att.checkOut.time).toLocaleTimeString() : 'N/A'}</td>
                <td>{att.workingHours || 0} hrs</td>
                <td>
                  <span className={`badge badge-${att.status === 'Present' ? 'success' : att.status === 'Absent' ? 'danger' : 'warning'}`}>
                    {att.status}
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

export default Attendance;


