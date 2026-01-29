import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Edit, Trash2, Clock, UserPlus, Download } from 'lucide-react';
import { supabaseService } from '../lib/supabase';

const ManageEmployee: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    photo: null,
    status: 'Active',
    school: '',
    employeeType: '',
    department: '',
    designation: '',
    name: ''
  });
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [employeeTypes, setEmployeeTypes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadEmployeeTypes();
    loadDepartments();
    loadDesignations();
    loadSchools();
  }, []);

  useEffect(() => {
    if (form.department) {
      const filtered = designations.filter(d => String(d.department_id) === String(form.department));
      setFilteredDesignations(filtered);
    } else {
      setFilteredDesignations([]);
    }
  }, [form.department, designations]);

  const loadSchools = async () => {
    try {
      const { data, error } = await supabaseService.getSchools();
      if (!error && user.school_id) {
        const userSchool = data?.filter(s => s.id === user.school_id) || [];
        setSchools(userSchool);
        if (userSchool.length > 0) {
          setForm(prev => ({ ...prev, school: user.school_id }));
        }
      }
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      console.log('Loading departments for school_id:', user.school_id);
      const { data, error } = await supabaseService.getDepartments(user.school_id);
      console.log('Departments from DB:', data);
      if (!error) {
        const filtered = data?.filter(dept => String(dept.school_id) === String(user.school_id)) || [];
        console.log('Filtered departments:', filtered);
        setDepartments(filtered);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadDesignations = async () => {
    try {
      console.log('Loading designations for school_id:', user.school_id);
      const { data, error } = await supabaseService.getDesignations(user.school_id);
      console.log('Designations from DB:', data);
      if (!error) {
        const filtered = data?.filter(desig => String(desig.school_id) === String(user.school_id)) || [];
        console.log('Filtered designations:', filtered);
        setDesignations(filtered);
      }
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
        const filtered = data?.filter(type => type.school_id === user.school_id) || [];
        setEmployeeTypes(filtered);
      }
    } catch (error) {
      console.error('Error loading employee types:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseService.getEmployees(user.school_id);
      if (error) {
        console.error('Error loading employees:', error);
        return;
      }
      console.log('Loaded employees:', data);
      const filtered = data?.filter(emp => String(emp.school_id) === String(user.school_id)) || [];
      console.log('Filtered employees:', filtered);
      setEmployees(filtered);
      setFilteredEmployees([]);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...employees];
    
    if (form.school) {
      filtered = filtered.filter(emp => String(emp.school_id) === String(form.school));
    }
    if (form.employeeType) {
      filtered = filtered.filter(emp => String(emp.employee_type_id) === String(form.employeeType));
    }
    if (form.department) {
      filtered = filtered.filter(emp => String(emp.department_id) === String(form.department));
    }
    if (form.designation) {
      filtered = filtered.filter(emp => String(emp.designation_id) === String(form.designation));
    }
    if (form.name) {
      filtered = filtered.filter(emp => 
        (emp.first_name?.toLowerCase().includes(form.name.toLowerCase()) || 
         emp.last_name?.toLowerCase().includes(form.name.toLowerCase()))
      );
    }
    
    setFilteredEmployees(filtered);
  };

  const handleCancel = () => {
    setForm({
      photo: null,
      status: 'Active',
      school: user.school_id,
      employeeType: '',
      department: '',
      designation: '',
      name: ''
    });
    setFilteredEmployees([]);
  };

  const handleToggleStatus = async (employeeId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'De-active' : 'Active';
    try {
      const { error } = await supabaseService.updateEmployee(employeeId, { status: newStatus });
      if (error) {
        alert('Error updating status: ' + error.message);
        return;
      }
      alert(`Employee status changed to ${newStatus}`);
      loadEmployees();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleDelete = async (employeeId: string, employeeName: string) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      try {
        const { error } = await supabaseService.deleteEmployee(employeeId, user.school_id);
        if (error) {
          alert('Error deleting employee: ' + error.message);
          return;
        }
        alert('Employee deleted successfully!');
        loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee');
      }
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

      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => window.location.hash = '#/hr/add_employee'}
          className="bg-green-600 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[150px] flex items-center justify-center gap-2 active:scale-95 shadow-md"
        >
          ADD NEW EMPLOYEE
        </button>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b">
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Status:</div>
            <div className="flex-1 px-2 flex gap-2">
              <label className="flex items-center text-xs">
                <input type="radio" name="status" value="Active" defaultChecked className="mr-1" />
                Active
              </label>
              <label className="flex items-center text-xs">
                <input type="radio" name="status" value="De-active" className="mr-1" />
                De-active
              </label>
            </div>
          </div>
          <div className="flex items-center h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">School:</div>
            <div className="flex-1 px-2">
              <select 
                value={form.school}
                onChange={(e) => setForm({...form, school: e.target.value})}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">--- Select ---</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>{school.school_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b">
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Type:</div>
            <div className="flex-1 px-2">
              <select 
                value={form.employeeType}
                onChange={(e) => setForm({...form, employeeType: e.target.value})}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">--- Select ---</option>
                {employeeTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.employee_type_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Department:</div>
            <div className="flex-1 px-2">
              <select 
                value={form.department}
                onChange={(e) => setForm({...form, department: e.target.value, designation: ''})}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">--- Select ---</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Designation:</div>
            <div className="flex-1 px-2">
              <select 
                value={form.designation}
                onChange={(e) => setForm({...form, designation: e.target.value})}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
              >
                <option value="">--- Select ---</option>
                {filteredDesignations.map((desig) => (
                  <option key={desig.id} value={desig.id}>{desig.designation_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 border-b">
          <div className="flex items-center h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Name:</div>
            <div className="flex-1 px-2">
              <input 
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                placeholder="Enter name"
              />
            </div>
          </div>
        </div>
        <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
          <button 
            onClick={handleSearch}
            className="bg-[#3498db] text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            SEARCH
          </button>
          <button 
            onClick={handleCancel}
            className="bg-gray-400 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            CANCEL
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Employee Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">SlNo.</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Add Marks</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit Time</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Delete</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Action</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Firstname</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">lastname</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Date Of Birth</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">UserName</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Password</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">department</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">designation</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Type of Employee</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Mobile</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">dateofjoining</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">OfficeEmail</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Download</th>
                <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={19} className="border border-gray-300 px-2 py-4 text-xs text-center">
                    Loading employees...
                  </td>
                </tr>
              ) : (filteredEmployees.length > 0 ? filteredEmployees : []).length === 0 ? (
                <tr>
                  <td colSpan={19} className="border border-gray-300 px-2 py-4 text-xs text-center">
                    {filteredEmployees.length === 0 && employees.length > 0 ? 'Click SEARCH to filter employees' : 'No employees found'}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button 
                        onClick={() => window.location.hash = `#/hr/add_employee?id=${employee.id}`}
                        className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-all" 
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button 
                        onClick={() => window.location.hash = '#/exams/add_students_marks'}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-all" 
                        title="Add Marks"
                      >
                        <UserPlus size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded transition-all" title="Edit Time">
                        <Clock size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button 
                        onClick={() => handleDelete(employee.id, `${employee.first_name} ${employee.last_name}`)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button 
                        onClick={() => handleToggleStatus(employee.id, employee.status || 'Active')}
                        className={`px-2 py-1 rounded text-xs hover:opacity-80 transition-colors ${
                          employee.status === 'Active' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {employee.status || 'Active'}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.first_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.last_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{employee.date_of_birth || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.first_name?.toLowerCase()}.{employee.last_name?.toLowerCase()}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">********</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.departments?.department_name || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.designations?.designation_name || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.employee_types?.employee_type_name || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{employee.mobile_no}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{employee.date_of_joining || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.office_email}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded transition-all" title="Download">
                        <Download size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{employee.id}</td>
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

export default ManageEmployee;