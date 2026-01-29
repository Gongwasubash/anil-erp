
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Fees from './pages/Fees';
import ExamsSimple from './pages/ExamsSimple';
import AddExamMarks from './pages/AddExamMarks';
import AddStudentMarks from './pages/AddStudentMarks';
import AddWorkingPresentDays from './pages/AddWorkingPresentDays';
import AssignSubjectTeachers from './pages/AssignSubjectTeachers';
import ChangePassword from './pages/ChangePassword';
import ViewStudentsMarks from './pages/ViewStudentsMarks';
import ViewStudentsMarksModule from './pages/ViewStudentsMarksModule';
import PrintAdmitCard from './pages/PrintAdmitCard';
import AdmitCardPrint from './pages/AdmitCardPrint';
import Masters from './pages/Masters';
import Admin from './pages/Admin';
import AddStudentVariableFee from './pages/AddStudentVariableFee';
import PrintPreBill from './pages/PrintPreBill';
import FeeSubmit from './pages/FeeSubmit';
import DailyFeeReceiptRegister from './pages/DailyFeeReceiptRegister';
import ManageEmployee from './pages/ManageEmployee';
import AddEmployee from './pages/AddEmployee';
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
      <Routes>
        <Route path="/view-students-marks-module" element={<ViewStudentsMarksModule />} />
        <Route path="/admit-card-print" element={<AdmitCardPrint />} />
        <Route path="/*" element={
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/students/*" element={<Students user={user} />} />
              <Route path="/fees/*" element={<Fees user={user} />} />
              <Route path="/exams/*" element={<ExamsSimple user={user} />} />
              <Route path="/exams/add_exam_marks" element={<AddExamMarks user={user} />} />
              <Route path="/exams/add_students_marks" element={<AddStudentMarks user={user} />} />
              <Route path="/exams/add_working_present_days" element={<AddWorkingPresentDays user={user} />} />
              <Route path="/exams/assign_subject_teachers" element={<AssignSubjectTeachers user={user} />} />
              <Route path="/change-password" element={<ChangePassword user={user} />} />
              <Route path="/exams/view_students_marks" element={<ViewStudentsMarks user={user} />} />
              <Route path="/exams/print_admit_card" element={<PrintAdmitCard user={user} />} />
              <Route path="/add-student-marks" element={<AddStudentMarks user={user} />} />
              <Route path="/variable-fees/add_student_variable_fee" element={<AddStudentVariableFee user={user} />} />
              <Route path="/variable-fees/print_pre_bill" element={<PrintPreBill user={user} />} />
              <Route path="/variable-fees/fee_submit" element={<FeeSubmit user={user} />} />
              <Route path="/variable-fees/daily_fee_receipt_register" element={<DailyFeeReceiptRegister user={user} />} />
              <Route path="/hr/manage_employee" element={<ManageEmployee user={user} />} />
              <Route path="/hr/add_employee" element={<AddEmployee user={user} />} />
              <Route path="/masters/*" element={<Masters user={user} />} />
              <Route path="/admin/*" element={<Admin user={user} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
