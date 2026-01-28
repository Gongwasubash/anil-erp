import React, { useState } from 'react';
import { School, CheckCircle } from 'lucide-react';
import { supabaseService } from '../lib/supabase';

const NewSchoolSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [formData, setFormData] = useState({
    schoolName: '',
    director: '',
    phone: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.schoolName || !formData.director || !formData.phone || !formData.email) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabaseService.supabase.rpc('setup_new_school', {
        p_school_name: formData.schoolName,
        p_director: formData.director,
        p_phone: formData.phone,
        p_email: formData.email
      });

      if (error) throw error;

      setCredentials({
        username: data.username,
        password: data.password
      });
      setSuccess(true);
      
      // Trigger school data refresh in Layout
      window.dispatchEvent(new CustomEvent('schoolCreated'));
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Complete!</h2>
          <p className="text-gray-600 mb-6">Your school has been created successfully.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Login Credentials</h3>
            <p className="text-blue-800">
              <strong>Username:</strong> {credentials.username}<br />
              <strong>Password:</strong> {credentials.password}
            </p>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <p><strong>Created:</strong></p>
            <ul className="list-disc list-inside text-left">
              <li>Classes 1-5</li>
              <li>Sections A, B, C</li>
              <li>Basic subjects</li>
              <li>Departments</li>
              <li>Current batch 2024-2025</li>
            </ul>
          </div>

          <button
            onClick={() => {
              alert('Please login with your new credentials to access your school.');
              window.location.href = '/login';
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Login with New Credentials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <School className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">New School Setup</h1>
          <p className="text-gray-600">Create your school with basic master data</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name *
            </label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter school name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Director Name *
            </label>
            <input
              type="text"
              value={formData.director}
              onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter director name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating School...' : 'Create School'}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500">
          <p><strong>This will create:</strong></p>
          <ul className="list-disc list-inside">
            <li>School profile</li>
            <li>Academic batch 2024-2025</li>
            <li>Classes 1-5 with sections A, B, C</li>
            <li>Basic subjects (English, Nepali, Math, Science)</li>
            <li>Admin and Academic departments</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewSchoolSetup;