import React, { useState, useEffect } from 'react';
import { Plus, School, GraduationCap, Building, BookOpen, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';

interface SimpleMastersProps {
  user: User;
}

const SimpleMasters: React.FC<SimpleMastersProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState({
    schoolName: '',
    director: '',
    phoneNo: '',
    email: '',
    address: '',
    shortName: '',
    prefixId: ''
  });

  const [setupComplete, setSetupComplete] = useState(false);
  const [createdSchoolId, setCreatedSchoolId] = useState('');

  const steps = [
    { id: 1, title: 'School Information', icon: School, completed: false },
    { id: 2, title: 'Review & Create', icon: CheckCircle, completed: false }
  ];

  const handleCreateSchool = async () => {
    if (!schoolData.schoolName || !schoolData.director || !schoolData.phoneNo || !schoolData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Use the simple school creation function
      const { data, error } = await supabaseService.supabase
        .rpc('create_new_school', {
          p_school_name: schoolData.schoolName,
          p_director: schoolData.director,
          p_phone: schoolData.phoneNo,
          p_email: schoolData.email,
          p_address: schoolData.address,
          p_short_name: schoolData.shortName,
          p_prefix_id: schoolData.prefixId
        });

      if (error) throw error;

      const result = data;
      setCreatedSchoolId(result.school_id);
      setSetupComplete(true);
      
      // Trigger school data refresh in Layout
      window.dispatchEvent(new CustomEvent('schoolCreated'));
      
      alert(`School created successfully!\n\nLogin Credentials:\nUsername: ${result.username}\nPassword: ${result.password}\n\nPlease save these credentials for future login.`);
    } catch (error: any) {
      console.error('Error creating school:', error);
      alert(`Error creating school: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (setupComplete) {
      return (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Your school management system has been set up successfully with all essential master data.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto mb-8">
            <h3 className="font-semibold text-green-900 mb-2">What's been created:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ School profile and settings</li>
              <li>✓ Current academic batch (2024-2025)</li>
              <li>✓ Classes (Nursery to Class 10)</li>
              <li>✓ Sections (A, B, C, D)</li>
              <li>✓ Core subjects (English, Nepali, Math, Science, etc.)</li>
              <li>✓ Departments (Admin, Academic, Finance, IT)</li>
              <li>✓ Basic fee heads</li>
              <li>✓ Admin user account</li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <School className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">School Information</h3>
              <p className="text-gray-600">Enter your school's basic information to get started</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={schoolData.schoolName}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={schoolData.director}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, director: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter director name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={schoolData.phoneNo}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, phoneNo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={schoolData.email}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label>
                <input
                  type="text"
                  value={schoolData.shortName}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, shortName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., EVR"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Prefix ID</label>
                <input
                  type="text"
                  value={schoolData.prefixId}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, prefixId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., EVR"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={schoolData.address}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school address"
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!schoolData.schoolName || !schoolData.director || !schoolData.phoneNo || !schoolData.email}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next: Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Review & Create</h3>
              <p className="text-gray-600">Review your information and create your school</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900">School Information</h4>
                  <p className="text-gray-600">{schoolData.schoolName}</p>
                  <p className="text-gray-600">Director: {schoolData.director}</p>
                  <p className="text-gray-600">Phone: {schoolData.phoneNo}</p>
                  <p className="text-gray-600">Email: {schoolData.email}</p>
                  {schoolData.address && <p className="text-gray-600">Address: {schoolData.address}</p>}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-blue-900 mb-3">What will be created automatically:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Academic Batch (2024-2025)
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Classes (Nursery to Class 10)
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Sections (A, B, C, D)
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Core Subjects
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Departments
                  </div>
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Fee Heads
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-green-900 mb-2">Login Credentials</h4>
                <p className="text-green-800">
                  <strong>Username:</strong> {schoolData.schoolName.toLowerCase().replace(/\s+/g, '')}<br />
                  <strong>Password:</strong> {schoolData.phoneNo}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Please save these credentials. You can change the password after logging in.
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleCreateSchool}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Creating School...' : 'Create School'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Setup Wizard</h1>
          <p className="text-gray-600">Set up your school management system in just a few steps</p>
        </div>

        {/* Progress Steps */}
        {!setupComplete && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default SimpleMasters;