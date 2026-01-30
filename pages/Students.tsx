
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2,
  Phone,
  X,
  Save,
  RotateCcw,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  Users,
  UserPlus,
  Settings,
  Upload,
  Calendar,
  ClipboardList,
  FileText,
  UserX,
  Download,
  FileUp
} from 'lucide-react';
import { Student, User } from '../types';
import { supabaseService } from '../lib/supabase';
import { adToBs } from '../constants';

const NEPAL_PROVINCES = [
  'Koshi Province',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province'
];

const NEPAL_DISTRICTS = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara", "Bardiya", "Bhaktapur", 
  "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusa", "Dolakha", 
  "Dolpa", "Doti", "Gorkha", "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot", 
  "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung", 
  "Lumbini", "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu", "Mustang", "Myagdi", "Nawalpur", "Nuwakot", 
  "Okhaldhunga", "Palpa", "Panchthar", "Parasi", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa", "Rautahat", 
  "Rolpa", "Rukum (East)", "Rukum (West)", "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari", "Sarlahi", 
  "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu", "Sunsari", "Surkhet", "Syangja", "Tanahu", "Taplejung", 
  "Terhathum", "Udayapur"
];

/**
 * Robustly formats date values (objects, strings, or ISO) to YYYY-MM-DD
 * This is crucial for HTML5 date inputs to show the correct value on load.
 */
const formatDateForInput = (dateVal: any) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Sub-components moved outside to prevent focus loss on re-render
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-6 mt-4">
    <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
    <h3 className="text-sm font-bold text-blue-700 uppercase tracking-widest">{title}</h3>
  </div>
);

const InputField = ({ label, name, value, onChange, placeholder, type = "text", required = false, readOnly = false, helper = "" }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 flex items-center justify-between">
      <span className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {helper && <span className="text-[9px] text-blue-500 font-black">{helper}</span>}
    </label>
    <input 
      name={name}
      value={value || ''}
      onChange={onChange}
      type={type} 
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:ring-4 outline-none transition-all 
        ${readOnly ? 'bg-blue-50/50 border-blue-100 text-blue-700 cursor-not-allowed' : 'bg-gray-50 border-gray-200 focus:ring-blue-100 focus:border-blue-400 placeholder:text-gray-300'}
      `}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false, readOnly = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select 
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      disabled={readOnly}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:ring-4 outline-none transition-all
         ${readOnly ? 'bg-blue-50/50 border-blue-100 text-blue-700 cursor-not-allowed' : 'bg-gray-50 border-gray-200 focus:ring-blue-100 focus:border-blue-400'}
      `}
    >
      <option value="">Select {label}</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

interface StudentsProps {
  user: User;
}

const Students: React.FC<StudentsProps> = ({ user }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add');
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModule, setActiveModule] = useState('ENTER NEW STUDENT');
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const studentModules = [
    { id: 'ENTER NEW STUDENT', label: 'ENTER NEW STUDENT', icon: UserPlus },
    { id: 'MANAGE STUDENT', label: 'MANAGE STUDENT', icon: Users },
    { id: 'MANAGE STUDENT GROUPS', label: 'MANAGE STUDENT GROUPS', icon: Settings },
    { id: 'UPLOAD STUDENT IMAGE', label: 'UPLOAD STUDENT IMAGE', icon: Upload },
    { id: 'STUDENT DAY ATTENDANCE', label: 'STUDENT DAY ATTENDANCE', icon: Calendar },
    { id: 'ATTENDANCE REGISTER', label: 'ATTENDANCE REGISTER', icon: ClipboardList },
    { id: 'STUDENT ATTENDANCE REPORTS', label: 'STUDENT ATTENDANCE REPORTS', icon: FileText },
    { id: 'STUDENT ABSENT REPORTS', label: 'STUDENT ABSENT REPORTS', icon: UserX }
  ];

  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
    setShowDropdown(false);
    
    if (moduleId === 'ENTER NEW STUDENT') {
      setFormData(initialFormState);
      setFormMode('add');
      setSameAsPermanent(false);
      setShowForm(true);
    }
    // MANAGE STUDENT is the default table view - no action needed
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'School', 'Branch Name', 'Batch No', 'Class', 'Section', 'House', 'Roll No',
      'SRN', 'Enrollment No', 'Form No', 'First Name', 'Last Name', 'DOB (AD)', 'DOB (BS)',
      'Landline No', 'Gender', 'Mobile 1', 'Mobile 2', 'Personal Email', 'School Email',
      'Height', 'Weight', 'Blood Group', 'Status', 'Father Name', 'Mother Name',
      'Father Mobile 1', 'Father Mobile 2', 'Father Landline', 'P Country', 'P State',
      'P District', 'P City', 'P Address 1', 'P Address 2', 'P Pin', 'Local Guardian Name',
      'Relation', 'Local Guardian Mobile', 'Local Landline', 'Local Email', 'L Address 1',
      'L Address 2', 'L Pin', 'Academic Year', 'Fee Category'
    ];
    
    const csvData = students.map(student => [
      student.id || '',
      student.school || '',
      student.branch_name || '',
      student.batch_no || '',
      student.class || '',
      student.section || '',
      student.house || '',
      student.roll_no || '',
      student.srn || '',
      student.enrollment_no || '',
      student.form_no || '',
      student.first_name || '',
      student.last_name || '',
      student.dob_ad || '',
      student.dob_bs || '',
      student.landline_no || '',
      student.gender || '',
      student.mobile1 || '',
      student.mobile2 || '',
      student.personal_email_id || '',
      student.school_email_id || '',
      student.height || '',
      student.weight || '',
      student.blood_group || '',
      student.status || '',
      student.father_name || '',
      student.mother_name || '',
      student.father_mobile1 || '',
      student.father_mobile2 || '',
      student.father_landline_no || '',
      student.p_country || '',
      student.p_state || '',
      student.p_district || '',
      student.p_city || '',
      student.p_address1 || '',
      student.p_address2 || '',
      student.p_pin || '',
      student.local_guardian_name || '',
      student.relation || '',
      student.local_guardian_mobile || '',
      student.local_landline_no || '',
      student.local_email || '',
      student.l_address1 || '',
      student.l_address2 || '',
      student.l_pin || '',
      student.academic_year || '',
      student.fee_category || ''
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_complete_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setErrorMsg('');
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header row and one data row');
        }
        
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const dataRows = lines.slice(1);
        
        console.log('Processing CSV with', dataRows.length, 'rows');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const line of dataRows) {
          try {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            
            // Map CSV columns to database fields
            const studentData = {
              school: values[headers.indexOf('School')] || null,
              branch_name: values[headers.indexOf('Branch Name')] || null,
              batch_no: values[headers.indexOf('Batch No')] || null,
              class: values[headers.indexOf('Class')] || null,
              section: values[headers.indexOf('Section')] || null,
              house: values[headers.indexOf('House')] || null,
              roll_no: values[headers.indexOf('Roll No')] || null,
              srn: values[headers.indexOf('SRN')] || null,
              enrollment_no: values[headers.indexOf('Enrollment No')] || null,
              form_no: values[headers.indexOf('Form No')] || null,
              first_name: values[headers.indexOf('First Name')] || 'Unknown',
              last_name: values[headers.indexOf('Last Name')] || 'Student',
              dob_ad: values[headers.indexOf('DOB (AD)')] || null,
              dob_bs: values[headers.indexOf('DOB (BS)')] || null,
              landline_no: values[headers.indexOf('Landline No')] || null,
              gender: values[headers.indexOf('Gender')] || null,
              mobile1: values[headers.indexOf('Mobile 1')] || null,
              mobile2: values[headers.indexOf('Mobile 2')] || null,
              personal_email_id: values[headers.indexOf('Personal Email')] || null,
              school_email_id: values[headers.indexOf('School Email')] || null,
              height: values[headers.indexOf('Height')] ? parseFloat(values[headers.indexOf('Height')]) : null,
              weight: values[headers.indexOf('Weight')] ? parseFloat(values[headers.indexOf('Weight')]) : null,
              blood_group: values[headers.indexOf('Blood Group')] || null,
              status: values[headers.indexOf('Status')] || 'Active',
              father_name: values[headers.indexOf('Father Name')] || 'Unknown Father',
              mother_name: values[headers.indexOf('Mother Name')] || 'Unknown Mother',
              father_mobile1: values[headers.indexOf('Father Mobile 1')] || null,
              father_mobile2: values[headers.indexOf('Father Mobile 2')] || null,
              father_landline_no: values[headers.indexOf('Father Landline')] || null,
              p_country: values[headers.indexOf('P Country')] || 'Nepal',
              p_state: values[headers.indexOf('P State')] || null,
              p_district: values[headers.indexOf('P District')] || null,
              p_city: values[headers.indexOf('P City')] || null,
              p_address1: values[headers.indexOf('P Address 1')] || null,
              p_address2: values[headers.indexOf('P Address 2')] || null,
              p_pin: values[headers.indexOf('P Pin')] || null,
              local_guardian_name: values[headers.indexOf('Local Guardian Name')] || null,
              relation: values[headers.indexOf('Relation')] || null,
              local_guardian_mobile: values[headers.indexOf('Local Guardian Mobile')] || null,
              local_landline_no: values[headers.indexOf('Local Landline')] || null,
              local_email: values[headers.indexOf('Local Email')] || null,
              l_address1: values[headers.indexOf('L Address 1')] || null,
              l_address2: values[headers.indexOf('L Address 2')] || null,
              l_pin: values[headers.indexOf('L Pin')] || null,
              academic_year: values[headers.indexOf('Academic Year')] || '2080',
              fee_category: values[headers.indexOf('Fee Category')] || 'General'
            };
            
            // Insert into database
            const { error } = await supabaseService.supabase
              .from('students')
              .insert([studentData]);
              
            if (error) {
              console.error('Error inserting student:', error);
              errorCount++;
            } else {
              successCount++;
            }
          } catch (rowError) {
            console.error('Error processing row:', rowError);
            errorCount++;
          }
        }
        
        setSuccessMsg(`Import completed! ${successCount} students imported successfully. ${errorCount > 0 ? `${errorCount} errors occurred.` : ''}`);
        fetchStudents(); // Refresh the table
        
        setTimeout(() => setSuccessMsg(''), 5000);
        
      } catch (err: any) {
        console.error('CSV Import Error:', err);
        setErrorMsg(err.message || 'Failed to import CSV file');
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  // Render Manage Student Page
  const renderManageStudentPage = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Students</h1>
          <p className="text-gray-500">Import, export, and manage student data efficiently.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveModule('ENTER NEW STUDENT')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            <UserPlus size={18} />
            Back to Students
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileUp size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Import Students</h3>
              <p className="text-gray-500">Upload CSV file to add multiple students</p>
            </div>
          </div>
          
          {successMsg && (
            <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-sm">
              <CheckCircle2 size={20} />
              <p className="font-bold">{successMsg}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
                id="csv-import-main"
                disabled={loading}
              />
              <label
                htmlFor="csv-import-main"
                className={`cursor-pointer block ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <Loader2 size={32} className="mx-auto text-blue-600 mb-2 animate-spin" />
                ) : (
                  <FileUp size={32} className="mx-auto text-gray-400 mb-2" />
                )}
                <p className="text-sm font-medium text-gray-600">
                  {loading ? 'Processing CSV file...' : 'Click to upload CSV file'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Supports .csv files only</p>
              </label>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 mb-2">CSV Format Required:</h4>
              <p className="text-xs text-blue-700">Upload a CSV file with columns: First Name, Last Name, Class, Section, Roll No, Mobile 1, Father Name, Mother Name</p>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Download size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Export Students</h3>
              <p className="text-gray-500">Download student data as CSV file</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Total Students:</span>
                <span className="font-bold text-blue-600">{students.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Active Students:</span>
                <span className="font-bold text-green-600">
                  {students.filter(s => s.status === 'Active').length}
                </span>
              </div>
            </div>
            
            <button
              onClick={exportToCSV}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all"
            >
              <Download size={20} />
              Export All Students
            </button>
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Roll No</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-4 py-3">{student.class} - {student.section}</td>
                  <td className="px-4 py-3">{student.roll_no}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleView(student)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleEdit(student)} className="p-1 text-amber-600 hover:bg-amber-100 rounded">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Initial form state
  const initialFormState = {
    school: '',
    batchNo: '',
    class: '',
    section: '',
    status: 'Active',
    academicYear: '2080',
    pCountry: 'Nepal',
    lCountry: 'Nepal',
    feeCategory: 'General',
    // Student Details
    srn: '',
    enrollmentNo: '',
    formNo: '',
    firstName: '',
    lastName: '',
    dobAD: '',
    dobBS: '',
    landlineNo: '',
    gender: '',
    mobile1: '',
    mobile2: '',
    personalEmailID: '',
    schoolEmailID: '',
    height: '',
    weight: '',
    // Parent Details
    fatherName: '',
    motherName: '',
    fatherMobile1: '',
    fatherMobile2: '',
    fatherLandlineNo: '',
    // Permanent Address
    pAddress1: '',
    pAddress2: '',
    pPin: '',
    // Local Guardian
    localGuardianName: '',
    relation: '',
    localGuardianMobile: '',
    localLandlineNo: '',
    localEmail: '',
    lAddress1: '',
    lAddress2: '',
    lPin: ''
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  useEffect(() => {
    fetchStudents();
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      if (user.role === 'Super Admin') {
        // Superadmin sees no data - fresh start
        setSchools([]);
        setBatches([]);
        setClasses([]);
        setSections([]);
        return;
      }
      
      if (!user.school_id) {
        setSchools([]);
        setBatches([]);
        setClasses([]);
        setSections([]);
        return;
      }
      
      const [schoolsRes, batchesRes, classesRes, sectionsRes] = await Promise.all([
        supabaseService.supabase.from('schools').select('*').eq('id', user.school_id),
        supabaseService.getBatches(user.school_id),
        supabaseService.getClasses(user.school_id),
        supabaseService.getSections(user.school_id)
      ]);
      
      setSchools(schoolsRes.data || []);
      setBatches(batchesRes.data || []);
      setClasses(classesRes.data || []);
      setSections(sectionsRes.data || []);
      
      // Auto-select logged-in user's school
      if (schoolsRes.data && schoolsRes.data.length > 0) {
        const userSchool = schoolsRes.data[0];
        setSearchFilters(prev => ({ ...prev, school: userSchool.school_name }));
      }
    } catch (err) {
      console.error('Error loading master data:', err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      console.log('Checking students table...');
      let query = supabaseService.supabase.from('students').select('*');
      
      // Filter by user's school if not Super Admin
      if (user.role !== 'Super Admin' && user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Students table error:', error);
        if (error.message.includes('relation "students" does not exist')) {
          setErrorMsg("Students table doesn't exist. Please create it in Supabase first.");
        } else {
          setErrorMsg(`Database error: ${error.message}`);
        }
        setStudents([]);
      } else {
        console.log('Students loaded:', data);
        setStudents(data || []);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setErrorMsg("Failed to load students. Check database connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (formMode === 'view') return;
    const { name, value } = e.target;
    
    setFormData((prev: any) => {
      const newState = { ...prev, [name]: value };
      
      // AUTO DATE CONVERSION (AD -> BS)
      if (name === 'dobAD') {
        newState.dobBS = adToBs(value);
      }

      // Sync local address if "Same as Permanent" is checked
      if (sameAsPermanent && name.startsWith('p')) {
        const localName = 'l' + name.slice(1);
        newState[localName] = value;
      }
      return newState;
    });
  };

  const toggleSameAddress = (checked: boolean) => {
    setSameAsPermanent(checked);
    if (checked) {
      setFormData((prev: any) => ({
        ...prev,
        lCountry: prev.pCountry,
        lState: prev.pState,
        lDistrict: prev.pDistrict,
        lCity: prev.pCity,
        lPin: prev.pPin,
        lAddress1: prev.pAddress1
      }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student record?")) return;
    try {
      setLoading(true);
      const { error } = await supabaseService.supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete student.");
      setLoading(false);
    }
  };

  const handleEdit = (student: any) => {
    // Map database fields back to form field names
    const preparedData = {
      ...initialFormState,
      // School Information
      school: student.school || '',
      branchName: student.branch_name || '',
      batchNo: student.batch_no || '',
      class: student.class || '',
      section: student.section || '',
      house: student.house || '',
      rollNo: student.roll_no || '',
      
      // Student Registration
      srn: student.srn || '',
      enrollmentNo: student.enrollment_no || '',
      formNo: student.form_no || '',
      
      // Personal Information
      firstName: student.first_name || '',
      lastName: student.last_name || '',
      dobAD: formatDateForInput(student.dob_ad),
      dobBS: student.dob_bs || '',
      landlineNo: student.landline_no || '',
      gender: student.gender || '',
      mobile1: student.mobile1 || '',
      mobile2: student.mobile2 || '',
      personalEmailID: student.personal_email_id || '',
      schoolEmailID: student.school_email_id || '',
      height: student.height || '',
      weight: student.weight || '',
      bloodGroup: student.blood_group || '',
      status: student.status || 'Active',
      
      // Parent Information
      fatherName: student.father_name || '',
      motherName: student.mother_name || '',
      fatherMobile1: student.father_mobile1 || '',
      fatherMobile2: student.father_mobile2 || '',
      fatherLandlineNo: student.father_landline_no || '',
      
      // Permanent Address
      pCountry: student.p_country || 'Nepal',
      pState: student.p_state || '',
      pDistrict: student.p_district || '',
      pCity: student.p_city || '',
      pAddress1: student.p_address1 || '',
      pAddress2: student.p_address2 || '',
      pPin: student.p_pin || '',
      
      // Local Guardian
      localGuardianName: student.local_guardian_name || '',
      relation: student.relation || '',
      localGuardianMobile: student.local_guardian_mobile || '',
      localLandlineNo: student.local_landline_no || '',
      localEmail: student.local_email || '',
      lAddress1: student.l_address1 || '',
      lAddress2: student.l_address2 || '',
      lPin: student.l_pin || '',
      
      // System Fields
      academicYear: student.academic_year || '2080',
      feeCategory: student.fee_category || 'General',
      
      // Keep the ID for updates
      id: student.id
    };
    
    setFormData(preparedData);
    setFormMode('edit');
    
    // Check if addresses match for checkbox
    const addressesMatch = 
      (student.p_address1 || '') === (student.l_address1 || '') && 
      (student.p_city || '') === (student.l_city || '') && 
      (student.p_district || '') === (student.l_district || '');
    setSameAsPermanent(addressesMatch);
    setShowForm(true);
  };

  const handleView = (student: any) => {
    // Map database fields back to form field names for viewing
    const preparedData = {
      ...initialFormState,
      // School Information
      school: student.school || '',
      branchName: student.branch_name || '',
      batchNo: student.batch_no || '',
      class: student.class || '',
      section: student.section || '',
      house: student.house || '',
      rollNo: student.roll_no || '',
      
      // Student Registration
      srn: student.srn || '',
      enrollmentNo: student.enrollment_no || '',
      formNo: student.form_no || '',
      
      // Personal Information
      firstName: student.first_name || '',
      lastName: student.last_name || '',
      dobAD: formatDateForInput(student.dob_ad),
      dobBS: student.dob_bs || '',
      landlineNo: student.landline_no || '',
      gender: student.gender || '',
      mobile1: student.mobile1 || '',
      mobile2: student.mobile2 || '',
      personalEmailID: student.personal_email_id || '',
      schoolEmailID: student.school_email_id || '',
      height: student.height || '',
      weight: student.weight || '',
      bloodGroup: student.blood_group || '',
      status: student.status || 'Active',
      
      // Parent Information
      fatherName: student.father_name || '',
      motherName: student.mother_name || '',
      fatherMobile1: student.father_mobile1 || '',
      fatherMobile2: student.father_mobile2 || '',
      fatherLandlineNo: student.father_landline_no || '',
      
      // Permanent Address
      pCountry: student.p_country || 'Nepal',
      pState: student.p_state || '',
      pDistrict: student.p_district || '',
      pCity: student.p_city || '',
      pAddress1: student.p_address1 || '',
      pAddress2: student.p_address2 || '',
      pPin: student.p_pin || '',
      
      // Local Guardian
      localGuardianName: student.local_guardian_name || '',
      relation: student.relation || '',
      localGuardianMobile: student.local_guardian_mobile || '',
      localLandlineNo: student.local_landline_no || '',
      localEmail: student.local_email || '',
      lAddress1: student.l_address1 || '',
      lAddress2: student.l_address2 || '',
      lPin: student.l_pin || '',
      
      // System Fields
      academicYear: student.academic_year || '2080',
      feeCategory: student.fee_category || 'General',
      
      // Keep the ID
      id: student.id
    };
    
    setFormData(preparedData);
    setFormMode('view');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'view') return;
    setSubmitting(true);
    setErrorMsg('');
    
    // Map form fields to database column names
    const finalData = {
      // School ID (critical for foreign key)
      school_id: user.school_id || null,
      
      // School Information
      school: formData.school || null,
      branch_name: formData.branchName || null,
      batch_no: formData.batchNo || null,
      class: formData.class || null,
      section: formData.section || null,
      house: formData.house || null,
      roll_no: formData.rollNo || null,
      
      // Student Registration Details
      srn: formData.srn || null,
      enrollment_no: formData.enrollmentNo || null,
      form_no: formData.formNo || null,
      
      // Personal Information (required fields)
      first_name: formData.firstName || 'Unknown',
      last_name: formData.lastName || 'Student',
      dob_ad: formData.dobAD || null,
      dob_bs: formData.dobBS || null,
      landline_no: formData.landlineNo || null,
      gender: formData.gender || null,
      mobile1: formData.mobile1 || null,
      mobile2: formData.mobile2 || null,
      personal_email_id: formData.personalEmailID || null,
      school_email_id: formData.schoolEmailID || null,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      blood_group: formData.bloodGroup || null,
      status: formData.status || 'Active',
      
      // Parent/Guardian Information (required fields)
      father_name: formData.fatherName || 'Unknown Father',
      mother_name: formData.motherName || 'Unknown Mother',
      father_mobile1: formData.fatherMobile1 || null,
      father_mobile2: formData.fatherMobile2 || null,
      father_landline_no: formData.fatherLandlineNo || null,
      
      // Permanent Address
      p_country: formData.pCountry || 'Nepal',
      p_state: formData.pState || null,
      p_district: formData.pDistrict || null,
      p_city: formData.pCity || null,
      p_address1: formData.pAddress1 || null,
      p_address2: formData.pAddress2 || null,
      p_pin: formData.pPin || null,
      
      // Local Guardian Information
      local_guardian_name: formData.localGuardianName || null,
      relation: formData.relation || null,
      local_guardian_mobile: formData.localGuardianMobile || null,
      local_landline_no: formData.localLandlineNo || null,
      local_email: formData.localEmail || null,
      l_address1: formData.lAddress1 || null,
      l_address2: formData.lAddress2 || null,
      l_pin: formData.lPin || null,
      
      // System Fields
      academic_year: formData.academicYear || '2080',
      fee_category: formData.feeCategory || 'General'
    };

    console.log('Submitting student data:', finalData);

    try {
      if (formMode === 'edit') {
        const { error } = await supabaseService.supabase
          .from('students')
          .update(finalData)
          .eq('id', formData.id);
        if (error) throw error;
        setSuccessMsg("Student record updated successfully!");
      } else {
        const { data, error } = await supabaseService.supabase
          .from('students')
          .insert([finalData])
          .select();
        if (error) throw error;
        console.log('Student inserted successfully:', data);
        setSuccessMsg("Student successfully admitted!");
      }

      setTimeout(() => {
        setSuccessMsg('');
        setShowForm(false);
        setFormData(initialFormState);
        fetchStudents();
      }, 2000);
    } catch (err: any) {
      console.error('Error saving student:', err);
      setErrorMsg(err.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  const [searchFilters, setSearchFilters] = useState({
    school: '',
    batch: '',
    class: '',
    section: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    school: '',
    batch: '',
    class: '',
    section: ''
  });

  const handleSearch = () => {
    setAppliedFilters({ ...searchFilters });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredStudents = students.filter(s => {
    // Require batch, class, and section to be selected (school is auto-selected)
    const hasAllRequiredFilters = appliedFilters.school && appliedFilters.batch && appliedFilters.class && appliedFilters.section;
    if (!hasAllRequiredFilters) return false;
    
    const nameMatch = searchTerm ? (
      s.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    
    const schoolMatch = !appliedFilters.school || s.school === appliedFilters.school;
    const batchMatch = !appliedFilters.batch || s.batch_no === appliedFilters.batch;
    const classMatch = !appliedFilters.class || s.class === appliedFilters.class;
    const sectionMatch = !appliedFilters.section || s.section === appliedFilters.section;
    
    return nameMatch && schoolMatch && batchMatch && classMatch && sectionMatch;
  });

  return (
    <div className="space-y-6">
      {/* Show Manage Student page when that module is selected */}
      {activeModule === 'MANAGE STUDENT' ? renderManageStudentPage() : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Information System</h1>
              <p className="text-gray-500">Cloud-synced database with automated Nepali date and district selection.</p>
            </div>
            <div className="flex gap-2">
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                  >
                    <Users size={18} />
                    {activeModule}
                    <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      {studentModules.map((module) => {
                        const IconComponent = module.icon;
                        return (
                          <button
                            key={module.id}
                            onClick={() => handleModuleSelect(module.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                              activeModule === module.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <IconComponent size={16} />
                            <span className="text-sm font-medium">{module.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm flex items-center gap-2">
                    <Filter size={18} /> Filters
                </button>
            </div>
          </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-in shake">
          <AlertCircle size={20} />
          <p className="font-bold">{errorMsg}</p>
        </div>
      )}

          {/* Student Search Filter */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Search Students</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">School</label>
                <div className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium bg-blue-50 border-blue-100 text-blue-700">
                  {schools.length > 0 ? schools[0].school_name : 'Loading...'}
                </div>
              </div>
              <SelectField 
                label="Batch" 
                name="batch" 
                value={searchFilters.batch} 
                onChange={handleFilterChange} 
                options={batches.map(b => b.batch_no)} 
              />
              <SelectField 
                label="Class" 
                name="class" 
                value={searchFilters.class} 
                onChange={handleFilterChange} 
                options={classes.map(c => c.class_name)} 
              />
              <SelectField 
                label="Section" 
                name="section" 
                value={searchFilters.section} 
                onChange={handleFilterChange} 
                options={sections.map(s => s.section_name)} 
              />
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by name"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm font-medium bg-gray-50 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
              >
                <Search size={18} />
                Search Students
              </button>
              <button
                onClick={() => {
                  setSearchFilters({ school: '', batch: '', class: '', section: '' });
                  setAppliedFilters({ school: '', batch: '', class: '', section: '' });
                  setSearchTerm('');
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all"
              >
                <X size={18} />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Main Table View */}
          <div className="bg-white border border-gray-300 overflow-hidden">
            <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">Student Records</h3>
              {loading && <Loader2 className="animate-spin text-blue-600" size={20} />}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Student Info</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Academic Info</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Contact</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Guardian</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Status</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && students.length === 0 ? (
                    <tr><td colSpan={6} className="border border-gray-300 px-2 py-4 text-xs text-center text-gray-500">Fetching Records...</td></tr>
                  ) : filteredStudents.length === 0 && (appliedFilters.school || appliedFilters.batch || appliedFilters.class || appliedFilters.section || searchTerm) ? (
                    <tr><td colSpan={6} className="border border-gray-300 px-2 py-4 text-xs text-center text-gray-500">No records found matching the selected filters.</td></tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr><td colSpan={6} className="border border-gray-300 px-2 py-4 text-xs text-center text-gray-500">Please apply filters to view student data.</td></tr>
                  ) : filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {student.first_name?.[0] || 'S'}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim()}</p>
                            <p className="text-xs text-gray-500">REG: {student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">
                        <div>
                            <span className="inline-block px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{student.class} - {student.section}</span>
                            <p className="text-xs text-gray-500 mt-1">Roll: {student.roll_no}</p>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                            <Phone size={12} className="text-blue-500" />
                            {student.mobile1 || 'N/A'}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">
                        <p className="text-xs font-semibold text-gray-700">{student.guardian_name || student.father_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{student.father_name ? 'Father' : 'Guardian'}</p>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded text-xs font-semibold
                          ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        `}>
                          {student.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleView(student)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-all"><Eye size={14} /></button>
                          <button onClick={() => handleEdit(student)} className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-all"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(student.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ADMISSION FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className={`p-8 border-b flex items-center justify-between text-white ${formMode === 'view' ? 'bg-slate-700' : formMode === 'edit' ? 'bg-amber-600' : 'bg-blue-600'}`}>
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  {formMode === 'view' ? 'Profile Details' : formMode === 'edit' ? 'Update Records' : 'Admission Form'}
                </h2>
                <p className="text-blue-100/80 text-xs font-bold uppercase tracking-widest mt-1">
                  {schools.length > 0 ? schools[0].school_name : 'Everest ERP'} • Database Row ID: {formData.id || 'NEW'}
                </p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                <X size={28} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
               {successMsg ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/20">
                      <CheckCircle2 size={40} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Success!</h3>
                      <p className="text-gray-500 font-medium">{successMsg}</p>
                    </div>
                 </div>
               ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                  
                  {/* SCHOOL INFO */}
                  <div className="space-y-6">
                    <SectionHeader title="School Information" />
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="School" name="school" value={formData.school} onChange={handleInputChange} options={schools.map(s => s.school_name)} required readOnly={formMode === 'view'} />
                        <InputField label="Branch Name" name="branchName" value={formData.branchName} onChange={handleInputChange} placeholder="Kathmandu Branch" readOnly={formMode === 'view'} />
                        <SelectField label="Batch No" name="batchNo" value={formData.batchNo} onChange={handleInputChange} options={batches.map(b => b.batch_no)} required readOnly={formMode === 'view'} />
                        <SelectField label="Class" name="class" value={formData.class} onChange={handleInputChange} options={classes.map(c => c.class_name)} required readOnly={formMode === 'view'} />
                        <SelectField label="Section" name="section" value={formData.section} onChange={handleInputChange} options={sections.map(s => s.section_name)} required readOnly={formMode === 'view'} />
                        <InputField label="House" name="house" value={formData.house} onChange={handleInputChange} placeholder="Red House" readOnly={formMode === 'view'} />
                        <InputField label="Roll Number" name="rollNo" value={formData.rollNo} onChange={handleInputChange} placeholder="64" required readOnly={formMode === 'view'} />
                        <InputField label="SRN" name="srn" value={formData.srn} onChange={handleInputChange} placeholder="Student Registration Number" readOnly={formMode === 'view'} />
                        <InputField label="Enrollment No" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleInputChange} placeholder="Enrollment Number" readOnly={formMode === 'view'} />
                        <InputField label="Form No" name="formNo" value={formData.formNo} onChange={handleInputChange} placeholder="EEF-102" readOnly={formMode === 'view'} />
                    </div>
                  </div>

                  {/* PERSONAL INFO */}
                  <div className="space-y-6">
                    <SectionHeader title="Personal Information" />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ex: Subash" required readOnly={formMode === 'view'} />
                        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Ex: Gongwa" required readOnly={formMode === 'view'} />
                        <InputField label="Date of Birth (AD)" name="dobAD" value={formData.dobAD} onChange={handleInputChange} type="date" required readOnly={formMode === 'view'} />
                        <InputField label="DOB (Nepali)" name="dobBS" value={formData.dobBS} onChange={handleInputChange} placeholder="YYYY-MM-DD" readOnly helper="Auto-converted" />
                        <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other']} required readOnly={formMode === 'view'} />
                        <SelectField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} options={['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']} readOnly={formMode === 'view'} />
                        <InputField label="Landline No" name="landlineNo" value={formData.landlineNo} onChange={handleInputChange} placeholder="01-XXXXXXX" readOnly={formMode === 'view'} />
                        <InputField label="Mobile No 1" name="mobile1" value={formData.mobile1} onChange={handleInputChange} placeholder="9840XXXXXX" required readOnly={formMode === 'view'} />
                        <InputField label="Mobile No 2" name="mobile2" value={formData.mobile2} onChange={handleInputChange} placeholder="9841XXXXXX" readOnly={formMode === 'view'} />
                        <InputField label="Personal Email ID" name="personalEmailID" value={formData.personalEmailID} onChange={handleInputChange} placeholder="student@gmail.com" type="email" readOnly={formMode === 'view'} />
                        <InputField label="School Email ID" name="schoolEmailID" value={formData.schoolEmailID} onChange={handleInputChange} placeholder="student@school.edu.np" type="email" readOnly={formMode === 'view'} />
                        <InputField label="Height (cm)" name="height" value={formData.height} onChange={handleInputChange} placeholder="165" type="number" readOnly={formMode === 'view'} />
                        <InputField label="Weight (kg)" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="55" type="number" readOnly={formMode === 'view'} />
                        <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'Inactive']} readOnly={formMode === 'view'} />
                    </div>
                  </div>

                  {/* PARENT/GUARDIAN INFO */}
                  <div className="lg:col-span-2 space-y-6">
                    <SectionHeader title="Parent/Guardian Information" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Father Details</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <InputField label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="Father's Full Name" required readOnly={formMode === 'view'} />
                                <InputField label="Father Mobile 1" name="fatherMobile1" value={formData.fatherMobile1} onChange={handleInputChange} placeholder="9840XXXXXX" readOnly={formMode === 'view'} />
                                <InputField label="Father Mobile 2" name="fatherMobile2" value={formData.fatherMobile2} onChange={handleInputChange} placeholder="9841XXXXXX" readOnly={formMode === 'view'} />
                                <InputField label="Father Landline No" name="fatherLandlineNo" value={formData.fatherLandlineNo} onChange={handleInputChange} placeholder="01-XXXXXXX" readOnly={formMode === 'view'} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mother Details</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <InputField label="Mother Name" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="Mother's Full Name" required readOnly={formMode === 'view'} />
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* ADDRESS DETAILS */}
                  <div className="lg:col-span-2 space-y-6">
                    <SectionHeader title="Address Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Permanent Address</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Country" name="pCountry" value={formData.pCountry} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <SelectField label="Province" name="pState" value={formData.pState} onChange={handleInputChange} options={NEPAL_PROVINCES} readOnly={formMode === 'view'} />
                                <SelectField label="District" name="pDistrict" value={formData.pDistrict} onChange={handleInputChange} options={NEPAL_DISTRICTS} readOnly={formMode === 'view'} />
                                <InputField label="City" name="pCity" value={formData.pCity} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <InputField label="Permanent Address Line 1" name="pAddress1" value={formData.pAddress1} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <InputField label="Permanent Address Line 2" name="pAddress2" value={formData.pAddress2} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <InputField label="Permanent Pin No" name="pPin" value={formData.pPin} onChange={handleInputChange} readOnly={formMode === 'view'} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Local Guardian</h4>
                                {formMode !== 'view' && (
                                  <label className="flex items-center gap-2 cursor-pointer">
                                      <input type="checkbox" checked={sameAsPermanent} onChange={(e) => toggleSameAddress(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                                      <span className="text-[10px] font-bold text-blue-600 uppercase">Mirror Permanent</span>
                                  </label>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <InputField label="Local Guardian Name" name="localGuardianName" value={formData.localGuardianName} onChange={handleInputChange} placeholder="Guardian's Full Name" readOnly={formMode === 'view'} />
                                <SelectField label="Relation" name="relation" value={formData.relation} onChange={handleInputChange} options={['Father', 'Mother', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Brother', 'Sister', 'Other']} readOnly={formMode === 'view'} />
                                <InputField label="Local Guardian Mobile" name="localGuardianMobile" value={formData.localGuardianMobile} onChange={handleInputChange} placeholder="9840XXXXXX" readOnly={formMode === 'view'} />
                                <InputField label="Landline No" name="localLandlineNo" value={formData.localLandlineNo} onChange={handleInputChange} placeholder="01-XXXXXXX" readOnly={formMode === 'view'} />
                                <InputField label="Email" name="localEmail" value={formData.localEmail} onChange={handleInputChange} placeholder="guardian@email.com" type="email" readOnly={formMode === 'view'} />
                                <InputField label="Local Address Line 1" name="lAddress1" value={formData.lAddress1} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <InputField label="Local Address Line 2" name="lAddress2" value={formData.lAddress2} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <InputField label="Local Address Pin No" name="lPin" value={formData.lPin} onChange={handleInputChange} readOnly={formMode === 'view'} />
                            </div>
                        </div>
                    </div>
                  </div>
               </div>
               )}
            </div>

            {/* Modal Footer */}
            {!successMsg && (
              <div className="p-8 border-t bg-white flex items-center justify-between">
                <div className="flex items-center gap-4 text-amber-600">
                  <CheckCircle2 size={24} />
                  <div>
                      <p className="text-xs font-bold uppercase tracking-tight">Active Backend Sync</p>
                      <p className="text-[10px] text-gray-400 font-medium">Data will be saved directly to Google Sheets columns.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {formMode !== 'view' ? (
                    <>
                      <button type="button" onClick={() => setFormData(initialFormState)} className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
                        <RotateCcw size={18} /> Reset
                      </button>
                      <button 
                        type="submit" 
                        disabled={submitting} 
                        className={`flex items-center gap-3 px-10 py-3.5 text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-70 ${formMode === 'edit' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {submitting ? "Processing..." : formMode === 'edit' ? "Update Record" : "Save Record"}
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setShowForm(false)} className="px-10 py-3.5 bg-slate-700 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all">
                      Close Detail View
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Students;
