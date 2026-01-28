import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { supabaseService } from '../lib/supabase';

const DeveloperDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseService.getUsers();
      if (error) {
        console.error('Error loading users:', error);
        return;
      }
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.username || !form.password) {
        alert('Please fill all required fields');
        return;
      }

      const userData = {
        username: form.username,
        password: form.password,
        role: form.role
      };

      if (editingUser) {
        const { error } = await supabaseService.updateUser(editingUser.id, userData);
        if (error) {
          alert('Error updating user: ' + error.message);
          return;
        }
        alert('User updated successfully!');
        setEditingUser(null);
      } else {
        const { error } = await supabaseService.createUser(userData);
        if (error) {
          alert('Error creating user: ' + error.message);
          return;
        }
        alert('User created successfully!');
      }

      setForm({ username: '', password: '', role: 'user' });
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: '',
      role: user.role
    });
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { error } = await supabaseService.deleteUser(userId);
      if (error) {
        alert('Error deleting user: ' + error.message);
        return;
      }
      alert('User deleted successfully!');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ username: '', password: '', role: 'user' });
  };

  return (
    <div className="w-full">
      <div className="mb-6 relative pb-4">
        <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
          Developer Dashboard - User Management
        </h2>
        <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="p-3 border-b border-gray-300 bg-gray-100">
          <h3 className="text-sm font-bold text-gray-700">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Username*</label>
              <input 
                type="text"
                value={form.username}
                onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Password*</label>
              <input 
                type="password"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                placeholder="Enter password"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Role</label>
              <select 
                value={form.role}
                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={handleSubmit}
              className="bg-[#3498db] text-white px-8 py-3 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all shadow-md"
            >
              {editingUser ? 'UPDATE' : 'CREATE USER'}
            </button>
            {editingUser && (
              <button 
                onClick={handleCancel}
                className="bg-gray-400 text-white px-8 py-3 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all shadow-md"
              >
                CANCEL
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">User Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">ID</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Username</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Role</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Status</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Created At</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-2 py-4 text-xs text-center">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-2 py-4 text-xs text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{user.id}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{user.username}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'developer' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-all" 
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" 
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;