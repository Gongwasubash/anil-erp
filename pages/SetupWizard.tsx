import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, School, Users, BookOpen, Settings, Building, GraduationCap } from 'lucide-react';
import { supabaseService } from '../lib/supabase';

interface SetupWizardProps {
  onComplete: (schoolData: any) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // School Data
  const [schoolData, setSchoolData] = useState({
    schoolName: '',
    director: '',
    panNo: '',
    prefixId: '',
    startingPoint: '1',
    shortName: '',
    accountantNo: '',
    feeDueNote: 'Please pay your fees on time to avoid any inconvenience.',
    feeReceiptNote: 'Thank you for your payment. Keep this receipt for your records.',
    country: 'Nepal',
    state: 'Bagmati Province',
    city: 'Kathmandu',
    phoneNo: '',
    address: '',
    email: '',
    websiteUrl: '',
    logoFile: null as File | null,
    signatureFile: null as File | null
  });

  // Batch Data
  const [batchData, setBatchData] = useState({
    batchNo: '2024-2025',
    shortName: '2024',
    isCurrentBatch: true
  });

  // Selected Classes and Sections
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Available options
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);

  const steps = [
    { id: 1, title: 'School Information', icon: School, description: 'Basic school details and contact information' },
    { id: 2, title: 'Academic Batch', icon: GraduationCap, description: 'Set up academic year/batch' },
    { id: 3, title: 'Classes & Sections', icon: Building, description: 'Select classes and sections' },
    { id: 4, title: 'Subjects', icon: BookOpen, description: 'Choose subjects for your school' },
    { id: 5, title: 'Departments', icon: Users, description: 'Set up organizational departments' },
    { id: 6, title: 'Review & Complete', icon: Settings, description: 'Review and finalize setup' }
  ];

  useEffect(() => {
    loadDefaultOptions();
  }, []);

  const loadDefaultOptions = async () => {
    try {
      // Load default classes, sections, subjects, and departments
      const [classesRes, sectionsRes, subjectsRes, departmentsRes] = await Promise.all([
        supabaseService.supabase.from('classes').select('*').is('school_id', null),
        supabaseService.supabase.from('sections').select('*').is('school_id', null),
        supabaseService.supabase.from('subjects').select('*').is('school_id', null),
        supabaseService.supabase.from('departments').select('*').is('school_id', null)
      ]);

      setAvailableClasses(classesRes.data || []);
      setAvailableSections(sectionsRes.data || []);
      setAvailableSubjects(subjectsRes.data || []);
      setAvailableDepartments(departmentsRes.data || []);

      // Pre-select common options
      setSelectedClasses(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      setSelectedSections(['A', 'B', 'C']);
      setSelectedSubjects(['ENG', 'NEP', 'MATH', 'SCI', 'SS']);
      setSelectedDepartments(['Administration', 'Academic', 'Finance']);
    } catch (error) {
      console.error('Error loading default options:', error);
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return schoolData.schoolName && schoolData.director && schoolData.phoneNo && schoolData.email;
      case 2:
        return batchData.batchNo && batchData.shortName;
      case 3:
        return selectedClasses.length > 0 && selectedSections.length > 0;
      case 4:
        return selectedSubjects.length > 0;
      case 5:
        return selectedDepartments.length > 0;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create school
      const schoolPayload = {
        ...schoolData,
        username: schoolData.schoolName.toLowerCase().replace(/\s+/g, ''),
        password: schoolData.phoneNo || '123456'
      };

      const { data: school, error: schoolError } = await supabaseService.createSchool(schoolPayload);
      if (schoolError) throw schoolError;

      const schoolId = school[0].id;

      // Create batch
      const { error: batchError } = await supabaseService.createBatch({
        ...batchData,
        school_id: schoolId
      });
      if (batchError) throw batchError;

      // Create classes
      const classesToCreate = availableClasses
        .filter((cls: any) => selectedClasses.includes(cls.short_name))
        .map((cls: any) => ({
          ...cls,
          school_id: schoolId,
          id: undefined
        }));

      const { data: createdClasses, error: classError } = await supabaseService.supabase
        .from('classes')
        .insert(classesToCreate)
        .select();
      if (classError) throw classError;

      // Create sections
      const sectionsToCreate = availableSections
        .filter((sec: any) => selectedSections.includes(sec.short_name))
        .map((sec: any) => ({
          ...sec,
          school_id: schoolId,
          id: undefined
        }));

      const { error: sectionError } = await supabaseService.supabase
        .from('sections')
        .insert(sectionsToCreate);
      if (sectionError) throw sectionError;

      // Create subjects
      const subjectsToCreate = availableSubjects
        .filter((subj: any) => selectedSubjects.includes(subj.subject_code))
        .map((subj: any) => ({
          ...subj,
          school_id: schoolId,
          id: undefined,
          class_ids: createdClasses.map(c => c.id)
        }));

      const { error: subjectError } = await supabaseService.supabase
        .from('subjects')
        .insert(subjectsToCreate);
      if (subjectError) throw subjectError;

      // Create departments
      const departmentsToCreate = availableDepartments
        .filter((dept: any) => selectedDepartments.includes(dept.department_name))
        .map((dept: any) => ({
          ...dept,
          school_id: schoolId,
          id: undefined
        }));

      const { error: deptError } = await supabaseService.supabase
        .from('departments')
        .insert(departmentsToCreate);
      if (deptError) throw deptError;

      // Create default fee heads
      const defaultFeeHeads = [
        { fee_head_name: 'Tuition Fee', amount: 5000, school_id: schoolId },
        { fee_head_name: 'Admission Fee', amount: 2000, school_id: schoolId },
        { fee_head_name: 'Exam Fee', amount: 500, school_id: schoolId },
        { fee_head_name: 'Library Fee', amount: 300, school_id: schoolId }
      ];

      const { error: feeError } = await supabaseService.supabase
        .from('fee_heads')
        .insert(defaultFeeHeads);
      if (feeError) throw feeError;

      // Create admin user for the school
      const { error: userError } = await supabaseService.supabase
        .from('users')
        .insert({
          school_id: schoolId,
          username: schoolPayload.username,
          password: schoolPayload.password,
          role: 'Admin',
          status: 'Active'
        });
      if (userError) throw userError;

      alert(`School setup completed successfully!\n\nLogin Credentials:\nUsername: ${schoolPayload.username}\nPassword: ${schoolPayload.password}`);
      onComplete(school[0]);
    } catch (error: any) {
      console.error('Setup error:', error);
      alert(`Setup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <School className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">School Information</h3>
              <p className="text-gray-600">Enter your school's basic information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
                <input
                  type="text"
                  value={schoolData.schoolName}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Director Name *</label>
                <input
                  type="text"
                  value={schoolData.director}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, director: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter director name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="text"
                  value={schoolData.phoneNo}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, phoneNo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
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
                  placeholder="Enter short name"
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <GraduationCap className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Academic Batch</h3>
              <p className="text-gray-600">Set up your current academic year</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch/Academic Year *</label>
                <input
                  type="text"
                  value={batchData.batchNo}
                  onChange={(e) => setBatchData(prev => ({ ...prev, batchNo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2024-2025"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Name *</label>
                <input
                  type="text"
                  value={batchData.shortName}
                  onChange={(e) => setBatchData(prev => ({ ...prev, shortName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2024"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="currentBatch"
                  checked={batchData.isCurrentBatch}
                  onChange={(e) => setBatchData(prev => ({ ...prev, isCurrentBatch: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="currentBatch" className="ml-2 block text-sm text-gray-900">
                  Set as current batch
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Classes & Sections</h3>
              <p className="text-gray-600">Select the classes and sections for your school</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Classes</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {availableClasses.map((cls: any) => (
                    <label key={cls.id} className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls.short_name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedClasses(prev => [...prev, cls.short_name]);
                          } else {
                            setSelectedClasses(prev => prev.filter(c => c !== cls.short_name));
                          }
                        }}
                        className="sr-only"
                      />
                      <span className={`font-medium ${selectedClasses.includes(cls.short_name) ? 'text-blue-600' : 'text-gray-700'}`}>
                        {cls.class_name}
                      </span>
                      {selectedClasses.includes(cls.short_name) && (
                        <CheckCircle className="ml-2 h-4 w-4 text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Sections</h4>
                <div className="grid grid-cols-5 gap-3">
                  {availableSections.map((sec: any) => (
                    <label key={sec.id} className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(sec.short_name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSections(prev => [...prev, sec.short_name]);
                          } else {
                            setSelectedSections(prev => prev.filter(s => s !== sec.short_name));
                          }
                        }}
                        className="sr-only"
                      />
                      <span className={`font-medium ${selectedSections.includes(sec.short_name) ? 'text-blue-600' : 'text-gray-700'}`}>
                        Section {sec.section_name}
                      </span>
                      {selectedSections.includes(sec.short_name) && (
                        <CheckCircle className="ml-2 h-4 w-4 text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <BookOpen className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Subjects</h3>
              <p className="text-gray-600">Choose subjects that will be taught in your school</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSubjects.map((subj: any) => (
                <label key={subj.id} className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subj.subject_code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubjects(prev => [...prev, subj.subject_code]);
                      } else {
                        setSelectedSubjects(prev => prev.filter(s => s !== subj.subject_code));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <div className={`font-medium ${selectedSubjects.includes(subj.subject_code) ? 'text-blue-600' : 'text-gray-900'}`}>
                      {subj.subject_name}
                    </div>
                    <div className="text-sm text-gray-500">Code: {subj.subject_code}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Departments</h3>
              <p className="text-gray-600">Set up organizational departments for your school</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDepartments.map((dept: any) => (
                <label key={dept.id} className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(dept.department_name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDepartments(prev => [...prev, dept.department_name]);
                      } else {
                        setSelectedDepartments(prev => prev.filter(d => d !== dept.department_name));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <div className={`font-medium ${selectedDepartments.includes(dept.department_name) ? 'text-blue-600' : 'text-gray-900'}`}>
                      {dept.department_name}
                    </div>
                    <div className="text-sm text-gray-500">{dept.about_department}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Settings className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Review & Complete</h3>
              <p className="text-gray-600">Review your setup and complete the process</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">School Information</h4>
                <p className="text-gray-600">{schoolData.schoolName} - {schoolData.director}</p>
                <p className="text-gray-600">{schoolData.phoneNo} | {schoolData.email}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Academic Batch</h4>
                <p className="text-gray-600">{batchData.batchNo} ({batchData.shortName})</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Classes</h4>
                <p className="text-gray-600">{selectedClasses.join(', ')}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Sections</h4>
                <p className="text-gray-600">{selectedSections.join(', ')}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Subjects</h4>
                <p className="text-gray-600">{selectedSubjects.join(', ')}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Departments</h4>
                <p className="text-gray-600">{selectedDepartments.join(', ')}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Login Credentials</h4>
              <p className="text-blue-800">
                <strong>Username:</strong> {schoolData.schoolName.toLowerCase().replace(/\s+/g, '')}<br />
                <strong>Password:</strong> {schoolData.phoneNo || '123456'}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Please save these credentials. You can change the password after logging in.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  completedSteps.includes(step.id) 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.id 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!validateCurrentStep()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;