import React, { useState } from 'react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';
import { Lock, CheckCircle } from 'lucide-react';

const ChangePassword: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [displayPassword, setDisplayPassword] = useState('');

  React.useEffect(() => {
    loadCurrentPassword();
  }, []);

  const loadCurrentPassword = async () => {
    try {
      if (user.role === 'Teacher' && user.employee_id) {
        const { data: employee } = await supabaseService.supabase
          .from('employees')
          .select('password')
          .eq('id', user.employee_id)
          .single();
        if (employee?.password) {
          setDisplayPassword(employee.password);
        }
      } else if (user.role === 'Admin' && user.school_id) {
        const { data: school } = await supabaseService.supabase
          .from('schools')
          .select('password')
          .eq('id', user.school_id)
          .single();
        if (school?.password) {
          setDisplayPassword(school.password);
        }
      }
    } catch (err) {
      console.error('Error loading password:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (user.role === 'Teacher' && user.employee_id) {
        // Verify current password for teacher
        const { data: employee } = await supabaseService.supabase
          .from('employees')
          .select('password')
          .eq('id', user.employee_id)
          .single();

        if (employee?.password !== form.currentPassword) {
          setError('Current password is incorrect');
          setLoading(false);
          return;
        }

        // Update password
        const { error } = await supabaseService.supabase
          .from('employees')
          .update({ password: form.newPassword })
          .eq('id', user.employee_id);

        if (error) {
          setError('Error updating password: ' + error.message);
        } else {
          setMessage('Password changed successfully!');
          setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
      } else if (user.role === 'Admin' && user.school_id) {
        // Verify current password for admin
        const { data: school } = await supabaseService.supabase
          .from('schools')
          .select('password')
          .eq('id', user.school_id)
          .single();

        if (school?.password !== form.currentPassword) {
          setError('Current password is incorrect');
          setLoading(false);
          return;
        }

        // Update password
        const { error } = await supabaseService.supabase
          .from('schools')
          .update({ password: form.newPassword })
          .eq('id', user.school_id);

        if (error) {
          setError('Error updating password: ' + error.message);
        } else {
          setMessage('Password changed successfully!');
          setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
      }
    } catch (err) {
      setError('Database connection error');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Change Password</h1>
          <p className="text-sm lg:text-base text-gray-500">Update your account password</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              CHANGE PASSWORD
            </h2>
            <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
              <CheckCircle size={20} />
              <p className="font-semibold">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {displayPassword && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-bold text-gray-700 mb-1">Your Current Password:</p>
                <p className="text-lg font-mono font-bold text-blue-700">{displayPassword}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password*</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password*</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password*</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3498db] text-white px-8 py-3 rounded-lg text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? 'UPDATING...' : 'CHANGE PASSWORD'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
