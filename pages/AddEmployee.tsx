import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';

const AddEmployee: React.FC<{ user: User }> = ({ user }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    employeeType: '',
    department: '',
    designation: '',
    mobileNo: '',
    homePhone: '',
    officeEmail: '',
    personalEmail: '',
    mailAddress: '',
    country: '',
    state: '',
    city: '',
    localAddress: '',
    localPinCode: '',
    permanentAddress: '',
    permanentPinCode: '',
    isAuthoriseSignatory: false,
    isWaiver: false,
    dateOfJoining: '',
    dateOfBirth: '',
    dateOfAnniversary: '',
    bloodGroup: '',
    panNo: '',
    gender: 'Male'
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [employeeTypes, setEmployeeTypes] = useState<any[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<any[]>([]);

  useEffect(() => {
    loadDepartments();
    loadDesignations();
    loadEmployeeTypes();
    
    // Check if editing
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = urlParams.get('id');
    if (id) {
      setEditingId(id);
      loadEmployee(id);
    }
  }, []);

  useEffect(() => {
    console.log('Departments:', departments);
    console.log('All Designations:', designations);
    console.log('Selected Department:', form.department);
    console.log('Filtered Designations:', filteredDesignations);
    
    if (form.department) {
      const filtered = designations.filter(d => d.department_id == form.department);
      setFilteredDesignations(filtered);
    } else {
      setFilteredDesignations([]);
    }
  }, [form.department, designations]);

  const loadDepartments = async () => {
    try {
      const { data, error } = await supabaseService.getDepartments(user.school_id);
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Raw departments data:', data);
      const filtered = data?.filter(dept => String(dept.school_id) === String(user.school_id)) || [];
      setDepartments(filtered);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadDesignations = async () => {
    try {
      const { data, error } = await supabaseService.getDesignations(user.school_id);
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Raw designations data:', data);
      const filtered = data?.filter(desig => String(desig.school_id) === String(user.school_id)) || [];
      setDesignations(filtered);
    } catch (error) {
      console.error('Error loading designations:', error);
    }
  };

  const loadEmployeeTypes = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('employee_types')
        .select('*')
        .eq('school_id', user.school_id)
        .order('order_no');
      if (!error) {
        const filtered = data?.filter(type => String(type.school_id) === String(user.school_id)) || [];
        setEmployeeTypes(filtered);
      }
    } catch (error) {
      console.error('Error loading employee types:', error);
    }
  };

  const loadEmployee = async (id: string) => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        setForm({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          employeeType: data.employee_type_id?.toString() || '',
          department: data.department_id?.toString() || '',
          designation: data.designation_id?.toString() || '',
          mobileNo: data.mobile_no || '',
          homePhone: data.home_phone || '',
          officeEmail: data.office_email || '',
          personalEmail: data.personal_email || '',
          mailAddress: data.mail_address || '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          localAddress: data.local_address || '',
          localPinCode: data.local_pin_code || '',
          permanentAddress: data.permanent_address || '',
          permanentPinCode: data.permanent_pin_code || '',
          isAuthoriseSignatory: data.is_authorise_signatory || false,
          isWaiver: data.is_waiver || false,
          dateOfJoining: data.date_of_joining || '',
          dateOfBirth: data.date_of_birth || '',
          dateOfAnniversary: data.date_of_anniversary || '',
          bloodGroup: data.blood_group || '',
          panNo: data.pan_no || '',
          gender: data.gender || 'Male'
        });
      }
    } catch (error) {
      console.error('Error loading employee:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!form.firstName || !form.lastName || !form.department || !form.designation || !form.mobileNo || !form.officeEmail || !form.personalEmail) {
        alert('Please fill all required fields marked with *');
        return;
      }

      const employeeData = {
        first_name: form.firstName,
        last_name: form.lastName,
        employee_type_id: form.employeeType ? parseInt(form.employeeType) : null,
        department_id: parseInt(form.department),
        designation_id: parseInt(form.designation),
        mobile_no: form.mobileNo,
        home_phone: form.homePhone,
        office_email: form.officeEmail,
        personal_email: form.personalEmail,
        mail_address: form.mailAddress,
        country: form.country,
        state: form.state,
        city: form.city,
        local_address: form.localAddress,
        local_pin_code: form.localPinCode,
        permanent_address: form.permanentAddress,
        permanent_pin_code: form.permanentPinCode,
        is_authorise_signatory: form.isAuthoriseSignatory,
        is_waiver: form.isWaiver,
        date_of_joining: form.dateOfJoining || null,
        date_of_birth: form.dateOfBirth || null,
        date_of_anniversary: form.dateOfAnniversary || null,
        blood_group: form.bloodGroup,
        pan_no: form.panNo,
        gender: form.gender,
        school_id: user.school_id
      };

      let result;
      if (editingId) {
        result = await supabaseService.updateEmployee(editingId, employeeData);
      } else {
        result = await supabaseService.createEmployee(employeeData);
      }
      
      if (result.error) {
        console.error('Error saving employee:', result.error);
        alert('Error saving employee: ' + result.error.message);
        return;
      }

      alert(editingId ? 'Employee updated successfully!' : 'Employee saved successfully!');
      window.location.hash = '#/hr/manage_employee';
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 relative pb-4">
        <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
          ManageEmployee
        </h2>
        <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="p-3 border-b border-gray-300 bg-gray-100">
          <h3 className="text-sm font-bold text-gray-700">EmployeeDetail</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">First Name*</label>
              <input 
                type="text"
                value={form.firstName}
                onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Last Name*</label>
              <input 
                type="text"
                value={form.lastName}
                onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Type of Employee</label>
              <select 
                value={form.employeeType}
                onChange={(e) => setForm(prev => ({ ...prev, employeeType: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">----Select-----</option>
                {employeeTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.employee_type_name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Department*</label>
              <select 
                value={form.department}
                onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value, designation: '' }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">----Select-----</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Designation*</label>
              <select 
                value={form.designation}
                onChange={(e) => setForm(prev => ({ ...prev, designation: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">----Select----</option>
                {filteredDesignations.map(desig => (
                  <option key={desig.id} value={desig.id}>{desig.designation_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Mobile No*</label>
              <input 
                type="text"
                value={form.mobileNo}
                onChange={(e) => setForm(prev => ({ ...prev, mobileNo: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">HomePhone</label>
              <input 
                type="text"
                value={form.homePhone}
                onChange={(e) => setForm(prev => ({ ...prev, homePhone: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Office Email*</label>
              <input 
                type="email"
                value={form.officeEmail}
                onChange={(e) => setForm(prev => ({ ...prev, officeEmail: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">PersonalEmail*</label>
              <input 
                type="email"
                value={form.personalEmail}
                onChange={(e) => setForm(prev => ({ ...prev, personalEmail: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">MailAddress</label>
              <input 
                type="text"
                value={form.mailAddress}
                onChange={(e) => setForm(prev => ({ ...prev, mailAddress: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Country</label>
              <select 
                value={form.country}
                onChange={(e) => setForm(prev => ({ ...prev, country: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">Select</option>
                <option value="Nepal">Nepal</option>
                <option value="India">India</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">State</label>
              <select 
                value={form.state}
                onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">----Select-----</option>
                <option value="Koshi">Koshi</option>
                <option value="Madhesh">Madhesh</option>
                <option value="Bagmati">Bagmati</option>
                <option value="Gandaki">Gandaki</option>
                <option value="Lumbini">Lumbini</option>
                <option value="Karnali">Karnali</option>
                <option value="Sudurpashchim">Sudurpashchim</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">City</label>
              <select 
                value={form.city}
                onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">----Select-----</option>
                <option value="Achham">Achham</option>
                <option value="Arghakhanchi">Arghakhanchi</option>
                <option value="Baglung">Baglung</option>
                <option value="Baitadi">Baitadi</option>
                <option value="Bajhang">Bajhang</option>
                <option value="Bajura">Bajura</option>
                <option value="Banke">Banke</option>
                <option value="Bara">Bara</option>
                <option value="Bardiya">Bardiya</option>
                <option value="Bhaktapur">Bhaktapur</option>
                <option value="Bhojpur">Bhojpur</option>
                <option value="Chitwan">Chitwan</option>
                <option value="Dadeldhura">Dadeldhura</option>
                <option value="Dailekh">Dailekh</option>
                <option value="Dang">Dang</option>
                <option value="Darchula">Darchula</option>
                <option value="Dhading">Dhading</option>
                <option value="Dhankuta">Dhankuta</option>
                <option value="Dhanusa">Dhanusa</option>
                <option value="Dolakha">Dolakha</option>
                <option value="Dolpa">Dolpa</option>
                <option value="Doti">Doti</option>
                <option value="Gorkha">Gorkha</option>
                <option value="Gulmi">Gulmi</option>
                <option value="Humla">Humla</option>
                <option value="Ilam">Ilam</option>
                <option value="Jajarkot">Jajarkot</option>
                <option value="Jhapa">Jhapa</option>
                <option value="Jumla">Jumla</option>
                <option value="Kailali">Kailali</option>
                <option value="Kalikot">Kalikot</option>
                <option value="Kanchanpur">Kanchanpur</option>
                <option value="Kapilvastu">Kapilvastu</option>
                <option value="Kaski">Kaski</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Kavrepalanchok">Kavrepalanchok</option>
                <option value="Khotang">Khotang</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Lamjung">Lamjung</option>
                <option value="Mahottari">Mahottari</option>
                <option value="Makwanpur">Makwanpur</option>
                <option value="Manang">Manang</option>
                <option value="Morang">Morang</option>
                <option value="Mugu">Mugu</option>
                <option value="Mustang">Mustang</option>
                <option value="Myagdi">Myagdi</option>
                <option value="Nawalparasi East">Nawalparasi East</option>
                <option value="Nawalparasi West">Nawalparasi West</option>
                <option value="Nuwakot">Nuwakot</option>
                <option value="Okhaldhunga">Okhaldhunga</option>
                <option value="Palpa">Palpa</option>
                <option value="Panchthar">Panchthar</option>
                <option value="Parbat">Parbat</option>
                <option value="Parsa">Parsa</option>
                <option value="Pyuthan">Pyuthan</option>
                <option value="Ramechhap">Ramechhap</option>
                <option value="Rasuwa">Rasuwa</option>
                <option value="Rautahat">Rautahat</option>
                <option value="Rolpa">Rolpa</option>
                <option value="Rukum East">Rukum East</option>
                <option value="Rukum West">Rukum West</option>
                <option value="Rupandehi">Rupandehi</option>
                <option value="Salyan">Salyan</option>
                <option value="Sankhuwasabha">Sankhuwasabha</option>
                <option value="Saptari">Saptari</option>
                <option value="Sarlahi">Sarlahi</option>
                <option value="Sindhuli">Sindhuli</option>
                <option value="Sindhupalchok">Sindhupalchok</option>
                <option value="Siraha">Siraha</option>
                <option value="Solukhumbu">Solukhumbu</option>
                <option value="Sunsari">Sunsari</option>
                <option value="Surkhet">Surkhet</option>
                <option value="Syangja">Syangja</option>
                <option value="Tanahu">Tanahu</option>
                <option value="Taplejung">Taplejung</option>
                <option value="Terhathum">Terhathum</option>
                <option value="Udayapur">Udayapur</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">LocalAddress</label>
              <textarea 
                value={form.localAddress}
                onChange={(e) => setForm(prev => ({ ...prev, localAddress: e.target.value }))}
                rows={3}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
              <input 
                type="text"
                placeholder="Pin Code"
                value={form.localPinCode}
                onChange={(e) => setForm(prev => ({ ...prev, localPinCode: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors mt-2"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Permanent Address</label>
              <textarea 
                value={form.permanentAddress}
                onChange={(e) => setForm(prev => ({ ...prev, permanentAddress: e.target.value }))}
                rows={3}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
              <input 
                type="text"
                placeholder="Pin Code"
                value={form.permanentPinCode}
                onChange={(e) => setForm(prev => ({ ...prev, permanentPinCode: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center text-xs">
                <input 
                  type="checkbox"
                  checked={form.isAuthoriseSignatory}
                  onChange={(e) => setForm(prev => ({ ...prev, isAuthoriseSignatory: e.target.checked }))}
                  className="mr-2"
                />
                Is Authorise Signatory
              </label>
              
              <label className="flex items-center text-xs">
                <input 
                  type="checkbox"
                  checked={form.isWaiver}
                  onChange={(e) => setForm(prev => ({ ...prev, isWaiver: e.target.checked }))}
                  className="mr-2"
                />
                Is Waiver
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Date Of Joining</label>
              <input 
                type="date"
                value={form.dateOfJoining}
                onChange={(e) => setForm(prev => ({ ...prev, dateOfJoining: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Date of Birth</label>
              <input 
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Date Of Anniversary</label>
              <input 
                type="date"
                value={form.dateOfAnniversary}
                onChange={(e) => setForm(prev => ({ ...prev, dateOfAnniversary: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">BloodGroup</label>
              <select 
                value={form.bloodGroup}
                onChange={(e) => setForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">PAN No.</label>
              <input 
                type="text"
                value={form.panNo}
                onChange={(e) => setForm(prev => ({ ...prev, panNo: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center text-xs">
                  <input 
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={form.gender === 'Male'}
                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="mr-1"
                  />
                  Male
                </label>
                <label className="flex items-center text-xs">
                  <input 
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={form.gender === 'Female'}
                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="mr-1"
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button 
              onClick={handleSubmit}
              className="bg-[#3498db] text-white px-8 py-3 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all shadow-md"
            >
              {editingId ? 'UPDATE' : 'SUBMIT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;