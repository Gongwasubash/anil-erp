import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';
import { CheckCircle, Save } from 'lucide-react';

const AssignModules: React.FC<{ user: User }> = ({ user }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [modules, setModules] = useState<any>({});
  const [originalModules, setOriginalModules] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const modulesList = {
    'HOME': [
      { id: 'reports', name: 'Reports' },
      { id: 'class_batch_details', name: 'Class / Batch Details' },
      { id: 'students_details', name: 'Students Details' },
      { id: 'employees_details', name: 'Employees Details' },
    ],
    'ADMIN': [
      { id: 'assign_modules', name: 'Assign Modules' },
      { id: 'change_password', name: 'Change Password' },
    ],
    'MASTERS': [
      { id: 'manage_branch', name: 'Manage Branch' },
      { id: 'manage_school', name: 'Manage School' },
      { id: 'add_batch', name: 'Add Batch' },
      { id: 'add_class', name: 'Add Class' },
      { id: 'add_section', name: 'Add Section' },
      { id: 'manage_class', name: 'Manage Class' },
      { id: 'manage_section', name: 'Manage Section' },
      { id: 'manage_department', name: 'Manage Department' },
      { id: 'manage_designation', name: 'Manage Designation' },
    ],
    'STUDENT': [
      { id: 'enter_new_student', name: 'Enter New Student' },
      { id: 'manage_student', name: 'Manage Student' },
    ],
    'HUMAN RESOURCES': [
      { id: 'manage_employee', name: 'Manage Employee' },
    ],
    'FEE DETAILS': [
      { id: 'fee_master', name: 'Fee Master' },
      { id: 'month_master', name: 'Month Master' },
      { id: 'due_student_fee', name: 'Due Student Fee' },
      { id: 'student_fee_submit', name: 'Student Fee Submit' },
    ],
    'VARIABLE FEE DETAILS': [
      { id: 'fee_head', name: 'Fee Head' },
      { id: 'add_student_variable_fee', name: 'Add Student Variable Fee' },
      { id: 'print_pre_bill', name: 'Print Pre Bill' },
      { id: 'fee_submit', name: 'Fee Submit' },
    ],
    'EXAMINATION': [
      { id: 'manage_grade', name: 'Manage Grade' },
      { id: 'exam_type', name: 'Exam Type' },
      { id: 'exam_name', name: 'Exam Name' },
      { id: 'add_exam_marks', name: 'Add Exam Marks' },
      { id: 'print_admit_card', name: 'Print Admit Card' },
      { id: 'add_students_marks', name: 'Add Students Marks' },
      { id: 'view_students_marks', name: 'View Students Marks' },
      { id: 'assign_subject_teachers', name: 'Assign Subject to Teachers' },
    ],
  };

  useEffect(() => {
    loadUsers();
  }, [user.school_id]);

  useEffect(() => {
    // Re-load selected user data when users array updates
    if (selectedUser && users.length > 0) {
      const selectedUserData = users.find(u => u.id === selectedUser);
      if (selectedUserData?.assigned_modules && Array.isArray(selectedUserData.assigned_modules)) {
        const assigned = {};
        selectedUserData.assigned_modules.forEach((m: string) => {
          assigned[m] = true;
        });
        setModules({ ...assigned });
        setOriginalModules({ ...assigned });
      }
    }
  }, [users]);

  const loadUsers = async () => {
    if (!user.school_id) return;
    try {
      const { data, error } = await supabaseService.supabase
        .from('employees')
        .select('id, first_name, last_name, assigned_modules')
        .eq('school_id', user.school_id)
        .order('first_name');
      
      console.log('Loaded users from DB:', data);
      if (!error && data) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleUserChange = async (userId: string) => {
    setSelectedUser(userId);
    setMessage('');
    if (!userId) {
      setModules({});
      setOriginalModules({});
      return;
    }
    
    // Fetch fresh data from database
    try {
      const { data, error } = await supabaseService.supabase
        .from('employees')
        .select('assigned_modules')
        .eq('id', userId)
        .single();
      
      console.log('Fetched user modules from DB:', data);
      
      if (!error && data?.assigned_modules && Array.isArray(data.assigned_modules)) {
        const assigned = {};
        data.assigned_modules.forEach((m: string) => {
          assigned[m] = true;
        });
        console.log('Setting modules:', assigned);
        setModules({ ...assigned });
        setOriginalModules({ ...assigned });
      } else {
        console.log('No modules found');
        setModules({});
        setOriginalModules({});
      }
    } catch (err) {
      console.error('Error fetching user modules:', err);
      setModules({});
      setOriginalModules({});
    }
  };

  const handleToggle = (moduleId: string) => {
    setModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSave = async () => {
    if (!selectedUser) {
      setMessage('Please select a user');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const assignedModules = Object.keys(modules).filter(k => modules[k]);
      console.log('Saving modules:', assignedModules);
      
      const { error } = await supabaseService.supabase
        .from('employees')
        .update({ assigned_modules: assignedModules })
        .eq('id', selectedUser);

      if (error) {
        setMessage('Error: ' + error.message);
        console.error('Save error:', error);
      } else {
        const isUpdate = Object.keys(originalModules).length > 0;
        setMessage(isUpdate ? 'Modules updated successfully!' : 'Modules assigned successfully!');
        
        // Update originalModules to reflect saved state
        const newOriginal = {};
        assignedModules.forEach(m => { newOriginal[m] = true; });
        setOriginalModules({ ...newOriginal });
        
        // Reload users to get fresh data from database
        await loadUsers();
        
        console.log('Save completed, modules saved:', assignedModules);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Save exception:', err);
      setMessage('Database error');
    }
    setLoading(false);
  };

  const hasChanges = () => {
    const currentKeys = Object.keys(modules).filter(k => modules[k]).sort();
    const originalKeys = Object.keys(originalModules).filter(k => originalModules[k]).sort();
    return JSON.stringify(currentKeys) !== JSON.stringify(originalKeys);
  };

  const isUpdate = Object.keys(originalModules).length > 0;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Assign Modules</h1>
        <p className="text-sm text-gray-500">Assign module permissions to users</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg text-[#2980b9] font-normal uppercase">ASSIGN MODULES</h2>
            <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <p className="font-semibold">{message}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">User Name</label>
            <select
              value={selectedUser}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">--Select--</option>
              {users.length === 0 && <option disabled>No employees found</option>}
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="mt-2 text-xs text-gray-500">Please add employees first from HR → Manage Employee</p>
            )}
          </div>

          {selectedUser && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Select Modules</h3>
              <div className="space-y-6">
                {Object.entries(modulesList).map(([category, items]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-gray-800 mb-3">{category}</h4>
                    <div className="space-y-2">
                      {items.map((module: any) => (
                        <label key={module.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={modules[module.id] || false}
                            onChange={() => handleToggle(module.id)}
                            className="w-4 h-4"
                          />
                          <span>{module.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={loading || !selectedUser || !hasChanges()}
              className="bg-[#3498db] text-white px-8 py-3 rounded-lg text-sm font-bold uppercase hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} />
              {loading ? (isUpdate ? 'UPDATING...' : 'SAVING...') : (isUpdate ? 'UPDATE' : 'SAVE')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignModules;
