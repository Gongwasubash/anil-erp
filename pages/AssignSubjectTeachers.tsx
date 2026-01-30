import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';
import { Trash2 } from 'lucide-react';

const AssignSubjectTeachers: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    employeeId: ''
  });

  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadSubjects();
    loadEmployees();
    loadAssignments();
  }, []);

  useEffect(() => {
    if (form.schoolId) {
      loadBatches();
      loadClasses();
      loadSections();
      loadSubjects();
      loadEmployees();
    }
  }, [form.schoolId]);

  const loadSchools = async () => {
    const { data, error } = await supabaseService.getSchools();
    if (!error && user.school_id) {
      const userSchools = data?.filter(s => s.id === user.school_id) || [];
      setSchools(userSchools);
      setForm(prev => ({ ...prev, schoolId: user.school_id }));
    }
  };

  const loadBatches = async () => {
    if (!form.schoolId) {
      setBatches([]);
      return;
    }
    const { data, error } = await supabaseService.supabase
      .from('batches')
      .select('*')
      .eq('school_id', form.schoolId)
      .order('batch_no');
    if (!error) setBatches(data || []);
  };

  const loadClasses = async () => {
    if (!form.schoolId) {
      setClasses([]);
      return;
    }
    const { data, error } = await supabaseService.supabase
      .from('classes')
      .select('*')
      .eq('school_id', form.schoolId)
      .order('class_name');
    if (!error) setClasses(data || []);
  };

  const loadSections = async () => {
    if (!form.schoolId) {
      setSections([]);
      return;
    }
    const { data, error } = await supabaseService.supabase
      .from('sections')
      .select('*')
      .eq('school_id', form.schoolId)
      .order('section_name');
    if (!error) setSections(data || []);
  };

  const loadSubjects = async () => {
    if (!form.schoolId) {
      setSubjects([]);
      return;
    }
    const { data, error } = await supabaseService.supabase
      .from('subjects')
      .select('*')
      .eq('school_id', form.schoolId)
      .order('subject_name');
    if (!error) setSubjects(data || []);
  };

  const loadEmployees = async () => {
    if (!form.schoolId) {
      setEmployees([]);
      return;
    }
    const { data, error } = await supabaseService.getEmployees(form.schoolId);
    console.log('Loaded employees:', data);
    if (data && data.length > 0) {
      console.log('First employee sample:', data[0]);
      console.log('First employee ID:', data[0].id, 'Type:', typeof data[0].id);
    }
    if (!error) {
      const filtered = data?.filter(emp => String(emp.school_id) === String(form.schoolId)) || [];
      console.log('Filtered employees:', filtered);
      setEmployees(filtered);
    }
  };

  const loadAssignments = async () => {
    if (!user.school_id) return;
    try {
      const query = supabaseService.supabase
        .from('subject_teacher_assignments')
        .select('*')
        .eq('school_id', user.school_id);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Load assignments error:', error);
      } else {
        const assignmentsWithDetails = await Promise.all((data || []).map(async (assignment) => {
          const [classData, sectionData, subjectData, employeeData] = await Promise.all([
            supabaseService.supabase.from('classes').select('class_name').eq('id', assignment.class_id).single(),
            supabaseService.supabase.from('sections').select('section_name').eq('id', assignment.section_id).single(),
            supabaseService.supabase.from('subjects').select('subject_name').eq('id', assignment.subject_id).single(),
            supabaseService.supabase.from('employees').select('first_name, last_name').eq('id', assignment.employee_id).single()
          ]);
          
          return {
            ...assignment,
            classes: classData.data,
            sections: sectionData.data,
            subjects: subjectData.data,
            employees: employeeData.data
          };
        }));
        
        setAssignments(assignmentsWithDetails);
      }
    } catch (err) {
      console.error('Load assignments catch error:', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId || !form.subjectId || !form.employeeId) {
      alert('Please fill all required fields');
      return;
    }

    const insertData = {
      school_id: form.schoolId,
      batch_id: parseInt(form.batchId),
      class_id: parseInt(form.classId),
      section_id: parseInt(form.sectionId),
      subject_id: parseInt(form.subjectId),
      employee_id: parseInt(form.employeeId)
    };

    setLoading(true);
    try {
      const { data, error } = await supabaseService.supabase
        .from('subject_teacher_assignments')
        .insert(insertData)
        .select();
      
      if (error) {
        alert('Error assigning subject: ' + error.message);
      } else {
        // Auto-add assign_subject_teachers module to employee
        const { data: empData } = await supabaseService.supabase
          .from('employees')
          .select('assigned_modules')
          .eq('id', form.employeeId)
          .single();
        
        const currentModules = empData?.assigned_modules || [];
        if (!currentModules.includes('assign_subject_teachers')) {
          await supabaseService.supabase
            .from('employees')
            .update({ assigned_modules: [...currentModules, 'assign_subject_teachers'] })
            .eq('id', form.employeeId);
        }
        
        alert('Subject assigned successfully!');
        setForm(prev => ({ ...prev, subjectId: '', employeeId: '' }));
        loadAssignments();
      }
    } catch (err) {
      console.error(err);
      alert('Database connection error');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      const { error } = await supabaseService.supabase
        .from('subject_teacher_assignments')
        .delete()
        .eq('id', id);
      
      if (error) {
        alert('Error deleting assignment: ' + error.message);
      } else {
        alert('Assignment deleted successfully!');
        loadAssignments();
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Assign Subject</h1>
          <p className="text-sm lg:text-base text-gray-500">Assign subjects to teachers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              ASSIGN SUBJECT
            </h2>
            <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
          </div>

          <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                  <select 
                    value={form.schoolId} 
                    onChange={(e) => setForm(p => ({ ...p, schoolId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {schools.map((school: any) => (
                      <option key={school.id} value={school.id}>{school.school_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                  <select 
                    value={form.batchId} 
                    onChange={(e) => setForm(p => ({ ...p, batchId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {batches.map((batch: any) => (
                      <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                  <select 
                    value={form.classId} 
                    onChange={(e) => setForm(p => ({ ...p, classId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {classes.map((cls: any) => (
                      <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                  <select 
                    value={form.sectionId} 
                    onChange={(e) => setForm(p => ({ ...p, sectionId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {sections.map((section: any) => (
                      <option key={section.id} value={section.id}>{section.section_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject*</label>
                  <select 
                    value={form.subjectId} 
                    onChange={(e) => setForm(p => ({ ...p, subjectId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">-----Select-----</option>
                    {subjects.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Employee*</label>
                  <select 
                    value={form.employeeId} 
                    onChange={(e) => setForm(p => ({ ...p, employeeId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--Select Employee--</option>
                    {employees.map((employee: any) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? 'ASSIGNING...' : 'ASSIGN'}
                </button>
              </div>
            </div>
          </div>

          {/* Assignments Table */}
          <div className="bg-white border border-gray-300 mt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sr.No.</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Section</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Subjects</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Employee Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border border-gray-300 px-2 py-4 text-xs text-center">
                        No assignments found
                      </td>
                    </tr>
                  ) : (
                    assignments.map((assignment: any, index: number) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">{index + 1}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">{assignment.classes?.class_name || '-'}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">{assignment.sections?.section_name || '-'}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">{assignment.subjects?.subject_name || '-'}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                          {assignment.employees ? `${assignment.employees.first_name} ${assignment.employees.last_name}` : '-'}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                          <button 
                            onClick={() => handleDelete(assignment.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" 
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectTeachers;
