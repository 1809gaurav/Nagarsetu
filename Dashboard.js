import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiUsers, FiClock, FiCalendar, FiAlertCircle, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, trendsRes, deptRes, activitiesRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/attendance/trends'),
        api.get('/dashboard/departments/employees'),
        api.get('/dashboard/recent')
      ]);

      setStats(statsRes.data);
      setAttendanceTrends(trendsRes.data);
      setDeptStats(deptRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">{t(language, 'loading')}</div>;
  }

  return (
    <div className="dashboard">
      <h1>{t(language, 'dashboard')}</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <h3>{t(language, 'totalEmployees')}</h3>
          <div className="value">{stats?.employees?.total || 0}</div>
          <p className="stat-subtitle">{t(language, 'active')}: {stats?.employees?.active || 0}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiClock />
          </div>
          <h3>{t(language, 'presentToday')}</h3>
          <div className="value">{stats?.attendance?.presentToday || 0}</div>
          <p className="stat-subtitle">{t(language, 'attendance')}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <h3>{t(language, 'pendingLeaves')}</h3>
          <div className="value">{stats?.pendingLeaves || 0}</div>
          <p className="stat-subtitle">{t(language, 'awaitingApproval')}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiAlertCircle />
          </div>
          <h3>{t(language, 'openGrievances')}</h3>
          <div className="value">{stats?.pendingGrievances || 0}</div>
          <p className="stat-subtitle">{t(language, 'inProgress')}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiBriefcase />
          </div>
          <h3>{t(language, 'openJobs')}</h3>
          <div className="value">{stats?.openJobs || 0}</div>
          <p className="stat-subtitle">{t(language, 'recruitment')}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <h3>{t(language, 'departments')}</h3>
          <div className="value">{stats?.departments || 0}</div>
          <p className="stat-subtitle">{t(language, 'totalDepartments')}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="card">
          <div className="card-header">
            <h2>{t(language, 'attendanceTrends')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10b981" name={t(language, 'active')} />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>{t(language, 'departmentWiseEmployees')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
              <Bar dataKey="vacancies" fill="#f59e0b" name="Vacancies" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {recentActivities.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>{t(language, 'recentActivities')}</h2>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>{t(language, 'category')}</th>
                <th>{t(language, 'subject')}</th>
                <th>{t(language, 'status')}</th>
                <th>{t(language, 'date')}</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity, index) => (
                <tr key={index}>
                  <td>
                    <span className={`badge badge-${activity.type === 'Leave' ? 'info' : 'warning'}`}>
                      {activity.type}
                    </span>
                  </td>
                  <td>{activity.title}</td>
                  <td>
                    <span className={`badge badge-${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  const statusMap = {
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'danger',
    'Open': 'info',
    'In Progress': 'warning',
    'Resolved': 'success'
  };
  return statusMap[status] || 'info';
};

export default Dashboard;


