
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Fees from './pages/Fees';
import Exams from './pages/Exams';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('erp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('erp_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/students/*" element={<Students user={user} />} />
          <Route path="/fees/*" element={<Fees user={user} />} />
          <Route path="/exams/*" element={<Exams user={user} />} />
          <Route path="/admin/*" element={<Admin user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
