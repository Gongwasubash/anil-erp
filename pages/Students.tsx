
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
  AlertCircle
} from 'lucide-react';
import { Student, User } from '../types';
import { callBackend } from '../services/api';
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

  // Initial form state
  const initialFormState = {
    school: 'EVEREST SEC SCHOOL',
    batchNo: '2080',
    class: 'Grade 10',
    section: 'Section A',
    status: 'Active',
    academicYear: '2080',
    pCountry: 'Nepal',
    lCountry: 'Nepal',
    feeCategory: 'General'
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'students' });
      setStudents(data || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to load students. Check API connection.");
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
      await callBackend('DELETE_DATA', { sheetName: 'students', id });
      fetchStudents();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete student.");
      setLoading(false);
    }
  };

  const handleEdit = (student: any) => {
    const preparedData = {
      ...student,
      dobAD: formatDateForInput(student.dobAD),
      dobBS: formatDateForInput(student.dobBS)
    };
    setFormData(preparedData);
    setFormMode('edit');
    // Mirror checkbox determination
    const addressesMatch = 
      (student.pAddress1 || '') === (student.lAddress1 || '') && 
      (student.pCity || '') === (student.lCity || '') && 
      (student.pDistrict || '') === (student.lDistrict || '');
    setSameAsPermanent(addressesMatch);
    setShowForm(true);
  };

  const handleView = (student: any) => {
    const preparedData = {
      ...student,
      dobAD: formatDateForInput(student.dobAD),
      dobBS: formatDateForInput(student.dobBS)
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
    
    const finalData = {
      ...formData,
      name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      guardianName: formData.fatherName || formData.motherName || 'N/A'
    };

    try {
      if (formMode === 'edit') {
        await callBackend('UPDATE_DATA', { sheetName: 'students', id: formData.id, data: finalData });
        setSuccessMsg("Student record updated successfully!");
      } else {
        await callBackend('SAVE_DATA', { sheetName: 'students', data: finalData });
        setSuccessMsg("Student successfully admitted!");
      }

      setTimeout(() => {
        setSuccessMsg('');
        setShowForm(false);
        setFormData(initialFormState);
        fetchStudents();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Information System</h1>
          <p className="text-gray-500">Cloud-synced database with automated Nepali date and district selection.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm flex items-center gap-2">
                <Filter size={18} /> Filters
            </button>
            <button 
                onClick={() => {
                  setFormData(initialFormState);
                  setFormMode('add');
                  setSameAsPermanent(false);
                  setShowForm(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
                <Plus size={20} /> Add New Student
            </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-in shake">
          <AlertCircle size={20} />
          <p className="font-bold">{errorMsg}</p>
        </div>
      )}

      {/* Main Table View */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search students..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {loading && <Loader2 className="animate-spin text-blue-600" size={20} />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Info</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Info</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Guardian</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && students.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-gray-400 font-medium">Fetching Records...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-gray-400 font-medium">No records found.</td></tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black shadow-sm uppercase">
                        {student.firstName?.[0] || 'S'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{student.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">REG: {student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-black uppercase">{student.class} - {student.section}</span>
                        <p className="text-[11px] font-bold text-gray-500">Roll: {student.rollNo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 font-bold">
                        <Phone size={14} className="text-blue-500" />
                        {student.mobile1 || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-gray-700">{student.guardianName}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{student.fatherName ? 'Father' : 'Guardian'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`
                      inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                      ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleView(student)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all"><Eye size={18} /></button>
                      <button onClick={() => handleEdit(student)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <p className="text-blue-100/80 text-xs font-bold uppercase tracking-widest mt-1">Everest ERP • Database Row ID: {formData.id || 'NEW'}</p>
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
                        <SelectField label="School" name="school" value={formData.school} onChange={handleInputChange} options={['EVEREST SEC SCHOOL', 'Branch A']} required readOnly={formMode === 'view'} />
                        <InputField label="Branch Name" name="branchName" value={formData.branchName} onChange={handleInputChange} placeholder="Kathmandu Branch" readOnly={formMode === 'view'} />
                        <SelectField label="Batch No" name="batchNo" value={formData.batchNo} onChange={handleInputChange} options={['2080', '2081']} required readOnly={formMode === 'view'} />
                        <SelectField label="Class" name="class" value={formData.class} onChange={handleInputChange} options={['Grade 10', 'Grade 9', 'Grade 8', 'Grade 7', 'Grade 6']} required readOnly={formMode === 'view'} />
                        <SelectField label="Section" name="section" value={formData.section} onChange={handleInputChange} options={['Section A', 'Section B', 'Section C']} required readOnly={formMode === 'view'} />
                        <InputField label="House" name="house" value={formData.house} onChange={handleInputChange} placeholder="Red House" readOnly={formMode === 'view'} />
                        <InputField label="Roll Number" name="rollNo" value={formData.rollNo} onChange={handleInputChange} placeholder="64" required readOnly={formMode === 'view'} />
                        <InputField label="Form No." name="formNo" value={formData.formNo} onChange={handleInputChange} placeholder="EEF-102" readOnly={formMode === 'view'} />
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
                        <InputField label="Mobile No" name="mobile1" value={formData.mobile1} onChange={handleInputChange} placeholder="9840XXXXXX" required readOnly={formMode === 'view'} />
                        <SelectField label="Status" name="status" value={formData.status} onChange={handleInputChange} options={['Active', 'Inactive']} readOnly={formMode === 'view'} />
                    </div>
                  </div>

                  {/* ADDRESS DETAILS */}
                  <div className="lg:col-span-2 space-y-6">
                    <SectionHeader title="Address Details (District/Province)" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Permanent Address</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Country" name="pCountry" value={formData.pCountry} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <SelectField label="Province" name="pState" value={formData.pState} onChange={handleInputChange} options={NEPAL_PROVINCES} readOnly={formMode === 'view'} />
                                <SelectField label="District" name="pDistrict" value={formData.pDistrict} onChange={handleInputChange} options={NEPAL_DISTRICTS} readOnly={formMode === 'view'} />
                                <InputField label="City" name="pCity" value={formData.pCity} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <InputField label="Pin No" name="pPin" value={formData.pPin} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <div className="col-span-2">
                                    <InputField label="Address Line 1" name="pAddress1" value={formData.pAddress1} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Local Address</h4>
                                {formMode !== 'view' && (
                                  <label className="flex items-center gap-2 cursor-pointer">
                                      <input type="checkbox" checked={sameAsPermanent} onChange={(e) => toggleSameAddress(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                                      <span className="text-[10px] font-bold text-blue-600 uppercase">Mirror Permanent</span>
                                  </label>
                                )}
                            </div>
                            <div className={`grid grid-cols-2 gap-4 transition-all ${sameAsPermanent ? 'opacity-40 pointer-events-none' : ''}`}>
                                <InputField label="Country" name="lCountry" value={formData.lCountry} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <SelectField label="Province" name="lState" value={formData.lState} onChange={handleInputChange} options={NEPAL_PROVINCES} readOnly={formMode === 'view'} />
                                <SelectField label="District" name="lDistrict" value={formData.lDistrict} onChange={handleInputChange} options={NEPAL_DISTRICTS} readOnly={formMode === 'view'} />
                                <InputField label="City" name="lCity" value={formData.lCity} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <InputField label="Pin No" name="lPin" value={formData.lPin} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                <div className="col-span-2">
                                    <InputField label="Address Line 1" name="lAddress1" value={formData.lAddress1} onChange={handleInputChange} readOnly={formMode === 'view'} />
                                </div>
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
