
import React, { useState } from 'react';
import { School, ShieldAlert, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';

const Login: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    try {
      // Check for superadmin first (for initial setup)
      if (trimmedUser.toLowerCase() === 'superadmin' && trimmedPass === 'admin123') {
        onLogin({ id: '1', username: 'Super Admin', role: 'Super Admin', status: 'Active' });
        return;
      }

      // Check schools table for school-specific authentication
      const { data: schools, error } = await supabaseService.supabase
        .from('schools')
        .select('*')
        .eq('username', trimmedUser)
        .eq('password', trimmedPass)
        .single();

      if (error || !schools) {
        setError('Invalid username or password. Please check your credentials.');
      } else {
        // Login successful with school credentials
        onLogin({ 
          id: schools.id, 
          username: schools.school_name, 
          role: 'Admin', 
          status: 'Active',
          school_id: schools.id
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-600/30 mb-2">
            <School size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">EVEREST SCHOOL</h1>
            <p className="text-gray-500 font-medium">Cloud Integrated ERP System</p>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-green-600">
              <CheckCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Database Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in shake duration-300">
                <ShieldAlert size={20} className="shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-gray-300"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-gray-700">Password</label>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot Password?</button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Sign in to Portal
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <div className="bg-blue-50/50 p-4 rounded-2xl space-y-2 text-center">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Default Admin Access</p>
                <p className="text-[11px] text-gray-500 font-medium">Username: <span className="text-gray-900 font-bold">superadmin</span></p>
                <p className="text-[11px] text-gray-500 font-medium">Password: <span className="text-gray-900 font-bold">admin123</span></p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
