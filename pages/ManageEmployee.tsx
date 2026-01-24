import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Edit, Trash2, Clock, UserPlus, Download } from 'lucide-react';
import { supabaseService } from '../lib/supabase';

const ManageEmployee: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    photo: null,
    status: 'Active',
    branch: 'Normal Max Test Admin',
    employeeType: '',
    department: '',
    designation: '',
    name: ''
  });
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseService.getEmployees();
      if (error) {
        console.error('Error loading employees:', error);
        return;
      }
      console.log('Loaded employees:', data);
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    console.log('Employee form submitted:', form);
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
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Branch:</div>
            <div className="flex-1 px-2">
              <select className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors">
                <option>Normal Max Test Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b">
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Type:</div>
            <div className="flex-1 px-2">
              <select className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors">
                <option value="">Select</option>
                <option>Teaching</option>
                <option>Non-Teaching</option>
              </select>
            </div>
          </div>
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Department:</div>
            <div className="flex-1 px-2">
              <select className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors">
                <option value="">Select</option>
                <option>Academic</option>
                <option>Finance</option>
                <option>HR</option>
              </select>
            </div>
          </div>
          <div className="flex items-center h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Designation:</div>
            <div className="flex-1 px-2">
              <select className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors">
                <option value="">--- Select ---</option>
                <option>Principal</option>
                <option>Teacher</option>
                <option>Accountant</option>
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
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                placeholder="Enter name"
              />
            </div>
          </div>
        </div>
        <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
          <button className="bg-[#3498db] text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md">
            SEARCH
          </button>
          <button className="bg-gray-400 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md">
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
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={19} className="border border-gray-300 px-2 py-4 text-xs text-center">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-all" title="Edit">
                        <Edit size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-all" title="Add Marks">
                        <UserPlus size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded transition-all" title="Edit Time">
                        <Clock size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors">
                        Action
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.first_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.last_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{employee.date_of_birth || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.first_name?.toLowerCase()}.{employee.last_name?.toLowerCase()}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">********</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.departments?.department_name || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{employee.designations?.designation_name || '-'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">-</td>
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