import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import MCDLogo from '../components/MCDLogo';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-controls">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="login-card">
        <div className="login-header">
          <MCDLogo size={80} />
          <h1>{t(language, 'appName')}</h1>
          <p className="tagline">{t(language, 'tagline')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">{t(language, 'email')}</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t(language, 'email')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t(language, 'password')}</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t(language, 'password')}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? t(language, 'loading') : t(language, 'login')}
          </button>
        </form>

        <div className="login-info">
          <p><strong>{t(language, 'demoCredentials')}:</strong></p>
          <p>Admin: admin@mcd.gov.in / admin123</p>
          <p>HR: hr@mcd.gov.in / hr123</p>
          <p>Employee: employee@mcd.gov.in / emp123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


