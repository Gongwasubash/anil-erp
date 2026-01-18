import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { User, School } from '../types';
import { supabaseService } from '../lib/supabase';

const Masters: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showEditSchool, setShowEditSchool] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    branchName: '',
    country: 'Nepal',
    state: '',
    city: '',
    phoneNo: '',
    address: '',
    email: '',
    websiteUrl: '',
    shortName: '',
    isActive: true
  });

  const nepalCities: { [key: string]: string[] } = {
    'Province No. 1': ['Biratnagar', 'Dharan', 'Itahari', 'Damak', 'Birtamod', 'Mechinagar', 'Triyuga'],
    'Madhesh Province': ['Janakpur', 'Birgunj', 'Kalaiya', 'Gaur', 'Malangwa', 'Bardibas', 'Rajbiraj'],
    'Bagmati Province': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Madhyapur Thimi', 'Kirtipur', 'Hetauda', 'Bharatpur'],
    'Gandaki Province': ['Pokhara', 'Gorkha', 'Baglung', 'Mustang', 'Myagdi', 'Parbat', 'Syangja'],
    'Lumbini Province': ['Butwal', 'Siddharthanagar', 'Tilottama', 'Devdaha', 'Sainamaina', 'Kapilvastu', 'Arghakhanchi'],
    'Karnali Province': ['Birendranagar', 'Gulariya', 'Dunai', 'Jumla', 'Chaur Jahari', 'Narayan', 'Dullu'],
    'Sudurpashchim Province': ['Dhangadhi', 'Mahendranagar', 'Tikapur', 'Ghodaghodi', 'Lamki Chuha', 'Dodhara Chandani', 'Parashuram']
  };

  const [branches, setBranches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolFormData, setSchoolFormData] = useState({
    schoolName: '',
    director: '',
    panNo: '',
    prefixId: '',
    startingPoint: '',
    shortName: '',
    accountantNo: '',
    branchId: '',
    feeDueNote: '',
    feeReceiptNote: '',
    logoFile: null as File | null,
    signatureFile: null as File | null
  });

  // Load branches and schools from Supabase
  useEffect(() => {
    loadBranches();
    loadSchools();
  }, []);

  const loadBranches = async () => {
    setLoading(true);
    const { data, error } = await supabaseService.getBranches();
    if (error) {
      console.error('Error loading branches:', error);
    } else {
      setBranches(data || []);
    }
    setLoading(false);
  };

  const loadSchools = async () => {
    const { data, error } = await supabaseService.getSchools();
    if (error) {
      console.error('Error loading schools:', error);
    } else {
      setSchools(data || []);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field === 'state') {
        return { ...prev, [field]: value, city: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log('Submitting branch data:', formData);
    
    const branchData = {
      branch_name: formData.branchName,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      phone_no: formData.phoneNo,
      address: formData.address,
      email: formData.email,
      website_url: formData.websiteUrl,
      short_name: formData.shortName,
      is_active: formData.isActive
    };
    
    console.log('Sending to Supabase:', branchData);
    
    const { data, error } = await supabaseService.createBranch(branchData);
    
    console.log('Supabase response:', { data, error });
    
    if (error) {
      console.error('Supabase error details:', error);
      alert(`Error creating branch: ${error.message}`);
    } else {
      alert('Branch created successfully!');
      setFormData({
        branchName: '',
        country: 'Nepal',
        state: '',
        city: '',
        phoneNo: '',
        address: '',
        email: '',
        websiteUrl: '',
        shortName: '',
        isActive: true
      });
      setShowAddForm(false);
      loadBranches();
    }
    setLoading(false);
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      branchName: branch.branch_name || '',
      country: branch.country || 'Nepal',
      state: branch.state || '',
      city: branch.city || '',
      phoneNo: branch.phone_no || '',
      address: branch.address || '',
      email: branch.email || '',
      websiteUrl: branch.website_url || '',
      shortName: branch.short_name || '',
      isActive: branch.is_active !== undefined ? branch.is_active : true
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    if (!editingBranch) return;
    
    setLoading(true);
    const branchData = {
      branch_name: formData.branchName,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      phone_no: formData.phoneNo,
      address: formData.address,
      email: formData.email,
      website_url: formData.websiteUrl,
      short_name: formData.shortName,
      is_active: formData.isActive
    };
    
    const { data, error } = await supabaseService.updateBranch(editingBranch.id, branchData);
    
    if (error) {
      console.error('Error updating branch:', error);
      alert(`Error updating branch: ${error.message}`);
    } else {
      alert('Branch updated successfully!');
      setShowEditForm(false);
      setEditingBranch(null);
      loadBranches();
    }
    setLoading(false);
  };

  const handleDelete = async (branch: any) => {
    if (window.confirm(`Are you sure you want to delete "${branch.branch_name}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteBranch(branch.id);
      
      if (error) {
        console.error('Error deleting branch:', error);
        alert(`Error deleting branch: ${error.message}`);
      } else {
        alert('Branch deleted successfully!');
        loadBranches();
      }
      setLoading(false);
    }
  };

  const handleEditSchool = (school: any) => {
    setEditingSchool(school);
    setSchoolFormData({
      schoolName: school.school_name || '',
      director: school.director || '',
      panNo: school.pan_no || '',
      prefixId: school.prefix_id || '',
      startingPoint: school.starting_point || '',
      shortName: school.short_name || '',
      accountantNo: school.accountant_no || '',
      branchId: school.branch_id || '',
      feeDueNote: school.fee_due_note || '',
      feeReceiptNote: school.fee_receipt_note || '',
      logoFile: null,
      signatureFile: null
    });
    setShowEditSchool(true);
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabaseService.supabase.storage
        .from('school-files')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabaseService.supabase.storage
        .from('school-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  };
  const handleSchoolInputChange = (field: string, value: string | File) => {
    setSchoolFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSchool = async () => {
    if (schools.length >= 1) {
      alert('Only one school is allowed. Please edit the existing school instead.');
      return;
    }
    
    setLoading(true);
    
    let logoUrl = null;
    let signatureUrl = null;
    
    if (schoolFormData.logoFile) {
      logoUrl = await uploadFile(schoolFormData.logoFile, 'logos');
    }
    
    if (schoolFormData.signatureFile) {
      signatureUrl = await uploadFile(schoolFormData.signatureFile, 'signatures');
    }
    
    const schoolData = {
      school_name: schoolFormData.schoolName,
      director: schoolFormData.director,
      pan_no: schoolFormData.panNo,
      prefix_id: schoolFormData.prefixId,
      starting_point: schoolFormData.startingPoint,
      short_name: schoolFormData.shortName,
      accountant_no: schoolFormData.accountantNo,
      branch_id: schoolFormData.branchId,
      fee_due_note: schoolFormData.feeDueNote,
      fee_receipt_note: schoolFormData.feeReceiptNote,
      logo_url: logoUrl,
      signature_url: signatureUrl
    };
    
    const { data, error } = await supabaseService.createSchool(schoolData);
    
    if (error) {
      console.error('Error creating school:', error);
      alert(`Error creating school: ${error.message}`);
    } else {
      alert('School created successfully!');
      setSchoolFormData({
        schoolName: '',
        director: '',
        panNo: '',
        prefixId: '',
        startingPoint: '',
        shortName: '',
        accountantNo: '',
        branchId: '',
        feeDueNote: '',
        feeReceiptNote: '',
        logoFile: null,
        signatureFile: null
      });
      setShowAddSchool(false);
      loadSchools();
    }
    setLoading(false);
  };

  const handleDeleteSchool = async (school: any) => {
    if (window.confirm(`Are you sure you want to delete "${school.school_name}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteSchool(school.id);
      
      if (error) {
        console.error('Error deleting school:', error);
        alert(`Error deleting school: ${error.message}`);
      } else {
        alert('School deleted successfully!');
        loadSchools();
      }
      setLoading(false);
    }
  };

  const handleUpdateSchool = async () => {
    if (!editingSchool) return;
    
    setLoading(true);
    
    let logoUrl = editingSchool.logo_url;
    let signatureUrl = editingSchool.signature_url;
    
    if (schoolFormData.logoFile) {
      logoUrl = await uploadFile(schoolFormData.logoFile, 'logos');
    }
    
    if (schoolFormData.signatureFile) {
      signatureUrl = await uploadFile(schoolFormData.signatureFile, 'signatures');
    }
    
    const schoolData = {
      school_name: schoolFormData.schoolName,
      director: schoolFormData.director,
      pan_no: schoolFormData.panNo,
      prefix_id: schoolFormData.prefixId,
      starting_point: schoolFormData.startingPoint,
      short_name: schoolFormData.shortName,
      accountant_no: schoolFormData.accountantNo,
      branch_id: schoolFormData.branchId,
      fee_due_note: schoolFormData.feeDueNote,
      fee_receipt_note: schoolFormData.feeReceiptNote,
      logo_url: logoUrl,
      signature_url: signatureUrl
    };
    
    const { data, error } = await supabaseService.updateSchool(editingSchool.id, schoolData);
    
    if (error) {
      console.error('Error updating school:', error);
      alert(`Error updating school: ${error.message}`);
    } else {
      alert('School updated successfully!');
      setShowEditSchool(false);
      setEditingSchool(null);
      loadSchools();
    }
    setLoading(false);
  };

  const filteredBranches = branches.filter((branch: any) => 
    branch.branch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [activeModule, setActiveModule] = useState(() => {
    const path = location.pathname;
    if (path.includes('manage_branch')) return 'manage_branch';
    if (path.includes('manage_school')) return 'manage_school';
    if (path.includes('add_batch')) return 'add_batch';
    if (path.includes('add_class')) return 'add_class';
    if (path.includes('add_section')) return 'add_section';
    if (path.includes('manage_class')) return 'manage_class';
    if (path.includes('manage_section')) return 'manage_section';
    if (path.includes('manage_religion')) return 'manage_religion';
    if (path.includes('manage_nationality')) return 'manage_nationality';
    if (path.includes('manage_student_cast')) return 'manage_student_cast';
    if (path.includes('subject_masters')) return 'subject_masters';
    if (path.includes('manage_calendar')) return 'manage_calendar';
    if (path.includes('manage_sms_template')) return 'manage_sms_template';
    if (path.includes('manage_blood_group')) return 'manage_blood_group';
    if (path.includes('manage_department')) return 'manage_department';
    if (path.includes('manage_designation')) return 'manage_designation';
    if (path.includes('class_subjects_teacher')) return 'class_subjects_teacher';
    return 'manage_branch';
  });

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('manage_branch')) setActiveModule('manage_branch');
    else if (path.includes('manage_school')) setActiveModule('manage_school');
    else if (path.includes('add_batch')) setActiveModule('add_batch');
    else if (path.includes('add_class')) setActiveModule('add_class');
    else if (path.includes('add_section')) setActiveModule('add_section');
    else if (path.includes('manage_class')) setActiveModule('manage_class');
    else if (path.includes('manage_section')) setActiveModule('manage_section');
    else if (path.includes('manage_religion')) setActiveModule('manage_religion');
    else if (path.includes('manage_nationality')) setActiveModule('manage_nationality');
    else if (path.includes('manage_student_cast')) setActiveModule('manage_student_cast');
    else if (path.includes('subject_masters')) setActiveModule('subject_masters');
    else if (path.includes('manage_calendar')) setActiveModule('manage_calendar');
    else if (path.includes('manage_sms_template')) setActiveModule('manage_sms_template');
    else if (path.includes('manage_blood_group')) setActiveModule('manage_blood_group');
    else if (path.includes('manage_department')) setActiveModule('manage_department');
    else if (path.includes('manage_designation')) setActiveModule('manage_designation');
    else if (path.includes('class_subjects_teacher')) setActiveModule('class_subjects_teacher');
  }, [location.pathname]);

  const handleNext = () => {
    setActiveModule('manage_school');
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'manage_school':
        if (showEditSchool && editingSchool) {
          return (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Manage School
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">School:</label>
                    <input 
                      value={schoolFormData.schoolName}
                      onChange={(e) => handleSchoolInputChange('schoolName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Director:</label>
                    <input 
                      value={schoolFormData.director}
                      onChange={(e) => handleSchoolInputChange('director', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Pan No.:</label>
                    <input 
                      value={schoolFormData.panNo}
                      onChange={(e) => handleSchoolInputChange('panNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">PrefixID:</label>
                    <input 
                      value={schoolFormData.prefixId}
                      onChange={(e) => handleSchoolInputChange('prefixId', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">StartingPoint:</label>
                    <input 
                      value={schoolFormData.startingPoint}
                      onChange={(e) => handleSchoolInputChange('startingPoint', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={schoolFormData.shortName}
                      onChange={(e) => handleSchoolInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Logo:</label>
                    {editingSchool?.logo_url && (
                      <div className="mb-2">
                        <img 
                          src={editingSchool.logo_url} 
                          alt="Current Logo" 
                          className="w-20 h-20 object-cover border rounded" 
                          onError={(e) => {
                            console.log('Logo URL error:', editingSchool.logo_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Current Logo</p>
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSchoolInputChange('logoFile', e.target.files?.[0] || null)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Signature:</label>
                    {editingSchool?.signature_url && (
                      <div className="mb-2">
                        <img src={editingSchool.signature_url} alt="Current Signature" className="w-20 h-20 object-cover border rounded" />
                        <p className="text-xs text-gray-500 mt-1">Current Signature</p>
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSchoolInputChange('signatureFile', e.target.files?.[0] || null)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Accountant No.:</label>
                    <input 
                      value={schoolFormData.accountantNo}
                      onChange={(e) => handleSchoolInputChange('accountantNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Branches:</label>
                    <select 
                      value={schoolFormData.branchId}
                      onChange={(e) => handleSchoolInputChange('branchId', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                    >
                      <option value="">---Select Branch---</option>
                      {branches.map((branch: any) => (
                        <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Due Note:</label>
                    <textarea 
                      value={schoolFormData.feeDueNote}
                      onChange={(e) => handleSchoolInputChange('feeDueNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Receipt Note:</label>
                    <textarea 
                      value={schoolFormData.feeReceiptNote}
                      onChange={(e) => handleSchoolInputChange('feeReceiptNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleUpdateSchool}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'UPDATING...' : 'UPDATE'}
                  </button>
                  <button 
                    onClick={() => setShowEditSchool(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage School
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search schools..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  if (schools.length >= 1) {
                    alert('Only one school is allowed. Please edit the existing school instead.');
                    return;
                  }
                  setShowAddSchool(!showAddSchool);
                  setShowEditSchool(false);
                  setSchoolFormData({
                    schoolName: '',
                    director: '',
                    panNo: '',
                    prefixId: '',
                    startingPoint: '',
                    shortName: '',
                    accountantNo: '',
                    branchId: '',
                    feeDueNote: '',
                    feeReceiptNote: ''
                  });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  schools.length >= 1 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={schools.length >= 1}
              >
                <Plus size={16} />
                {showAddSchool ? 'Cancel' : 'Add New School'}
              </button>
            </div>

            {showAddSchool && (
              <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-md font-bold text-gray-700">Add New School</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">School:</label>
                    <input 
                      value={schoolFormData.schoolName}
                      onChange={(e) => handleSchoolInputChange('schoolName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Director:</label>
                    <input 
                      value={schoolFormData.director}
                      onChange={(e) => handleSchoolInputChange('director', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter director name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Pan No.:</label>
                    <input 
                      value={schoolFormData.panNo}
                      onChange={(e) => handleSchoolInputChange('panNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter PAN number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">PrefixID:</label>
                    <input 
                      value={schoolFormData.prefixId}
                      onChange={(e) => handleSchoolInputChange('prefixId', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter prefix ID"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">StartingPoint:</label>
                    <input 
                      value={schoolFormData.startingPoint}
                      onChange={(e) => handleSchoolInputChange('startingPoint', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter starting point"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={schoolFormData.shortName}
                      onChange={(e) => handleSchoolInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter short name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Logo:</label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Signature:</label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Accountant No.:</label>
                    <input 
                      value={schoolFormData.accountantNo}
                      onChange={(e) => handleSchoolInputChange('accountantNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter accountant number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Branches:</label>
                    <select 
                      value={schoolFormData.branchId}
                      onChange={(e) => handleSchoolInputChange('branchId', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                    >
                      <option value="">---Select Branch---</option>
                      {branches.map((branch: any) => (
                        <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Due Note:</label>
                    <textarea 
                      value={schoolFormData.feeDueNote}
                      onChange={(e) => handleSchoolInputChange('feeDueNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter fee due note"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Receipt Note:</label>
                    <textarea 
                      value={schoolFormData.feeReceiptNote}
                      onChange={(e) => handleSchoolInputChange('feeReceiptNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter fee receipt note"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 p-6 pt-0">
                  <button 
                    onClick={handleCreateSchool}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'CREATING...' : 'CREATE'}
                  </button>
                  <button 
                    onClick={() => setShowAddSchool(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Logo</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">School</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student Prefix ID</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Starting Point</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Short Name</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Branches</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage Week Off</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage About Us</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage App Screen</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage School Physical</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {schools.map((school: any) => (
                      <tr key={school.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          {school.logo_url ? (
                            <img 
                              src={school.logo_url} 
                              alt="School Logo" 
                              className="w-12 h-12 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{school.prefix_id}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{school.school_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{school.prefix_id}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{school.starting_point}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{school.short_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">Main Campus</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditSchool(school)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSchool(school)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" 
                              title="Delete"
                            >
                              <Trash2 size={18} />
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
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Masters Management</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Select a module from the sidebar to get started.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Masters Management</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage all master data for the school system</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
            <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Quick Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Masters;