
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Fees from './pages/Fees';
import Exams from './pages/Exams';
import Masters from './pages/Masters';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { User } from './types';

const App: React.FC = () => {
  console.log('App component loaded');
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('erp_user');
    return saved ? JSON.parse(saved) : null;
  });

  console.log('Current user:', user);

  const handleLogin = (u: User) => {
    console.log('Login handler called with:', u);
    setUser(u);
    localStorage.setItem('erp_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    console.log('Logout handler called');
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  if (!user) {
    console.log('No user found, showing login');
    return <Login onLogin={handleLogin} />;
  }

  console.log('User found, showing main app');
  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/students/*" element={<Students user={user} />} />
          <Route path="/fees/*" element={<Fees user={user} />} />
          <Route path="/exams/*" element={<Exams user={user} />} />
          <Route path="/masters/*" element={<Masters user={user} />} />
          <Route path="/admin/*" element={<Admin user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
