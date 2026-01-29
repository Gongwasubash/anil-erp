import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';

const AddWorkingPresentDays: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    examTypeId: '',
    examNameId: ''
  });

  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examNames, setExamNames] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState<{[key: string]: {workingDays: string, presentDays: string, teacherRemarks: string}}>({});
  const [bulkData, setBulkData] = useState({ workingDays: '', presentDays: '', teacherRemarks: '' });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadExamTypes();
  }, []);

  useEffect(() => {
    if (form.schoolId) {
      loadBatches();
      loadClasses();
      loadSections();
      loadExamTypes();
    }
  }, [form.schoolId]);

  useEffect(() => {
    if (form.examTypeId) {
      loadExamNames();
    } else {
      setExamNames([]);
    }
  }, [form.examTypeId]);

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

  const loadExamTypes = async () => {
    if (!form.schoolId) {
      setExamTypes([]);
      return;
    }
    const { data, error } = await supabaseService.supabase
      .from('exam_types')
      .select('*')
      .eq('school_id', form.schoolId);
    if (!error) setExamTypes(data || []);
  };

  const loadExamNames = async () => {
    if (!form.schoolId || !form.examTypeId) {
      setExamNames([]);
      return;
    }
    const { data, error } = await supabaseService.supabase
      .from('exam_names')
      .select('*')
      .eq('school_id', form.schoolId)
      .eq('exam_type_id', form.examTypeId);
    if (!error) setExamNames(data || []);
  };

  const handleSearch = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId || !form.examTypeId || !form.examNameId) {
      alert('Please select all required fields');
      return;
    }
    setSearchLoading(true);
    await loadStudents();
    setSearchLoading(false);
  };

  const loadStudents = async () => {
    const { data, error } = await supabaseService.supabase
      .from('students')
      .select(`
        *,
        batches(batch_no),
        classes(class_name),
        sections(section_name)
      `)
      .eq('school_id', form.schoolId)
      .eq('batch_id', form.batchId)
      .eq('class_id', form.classId)
      .eq('section_id', form.sectionId)
      .order('roll_no');
    
    if (!error) {
      setStudents(data || []);
      loadExistingData(data || []);
    }
  };

  const loadExistingData = async (studentsList) => {
    if (!form.examTypeId || !form.examNameId) {
      setStudentData({});
      setHasExistingData(false);
      return;
    }
    
    const { data, error } = await supabaseService.supabase
      .from('student_attendance')
      .select('*')
      .eq('school_id', form.schoolId)
      .eq('batch_id', form.batchId)
      .eq('class_id', form.classId)
      .eq('section_id', form.sectionId)
      .eq('exam_type_id', form.examTypeId)
      .eq('exam_name_id', form.examNameId);
    
    if (!error && data && data.length > 0) {
      const existingData = {};
      data.forEach(record => {
        existingData[record.student_id] = {
          workingDays: record.working_days?.toString() || '',
          presentDays: record.present_days?.toString() || '',
          teacherRemarks: record.teacher_remarks || ''
        };
      });
      setStudentData(existingData);
      setHasExistingData(true);
    } else {
      setStudentData({});
      setHasExistingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId || !form.examTypeId || !form.examNameId) {
      alert('Please fill all required fields');
      return;
    }

    const dataToSave = [];
    for (const student of students) {
      const data = studentData[student.id] || {};
      if (data.workingDays || data.presentDays || data.teacherRemarks) {
        dataToSave.push({
          school_id: form.schoolId,
          batch_id: form.batchId,
          class_id: form.classId,
          section_id: form.sectionId,
          student_id: student.id,
          exam_type_id: form.examTypeId,
          exam_name_id: form.examNameId,
          working_days: parseInt(data.workingDays) || 0,
          present_days: parseInt(data.presentDays) || 0,
          teacher_remarks: data.teacherRemarks || ''
        });
      }
    }

    if (dataToSave.length === 0) {
      alert('Please enter data for at least one student');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseService.supabase
        .from('student_attendance')
        .upsert(dataToSave, {
          onConflict: 'student_id,school_id,batch_id,class_id,section_id,exam_type_id,exam_name_id'
        });
      
      if (error) {
        alert('Error saving data: ' + error.message);
      } else {
        alert(hasExistingData ? 'Working/Present days updated successfully!' : 'Working/Present days saved successfully!');
        if (students.length > 0) {
          await loadExistingData(students);
        }
      }
    } catch (err) {
      alert('Database connection error');
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Add Working/Present Days</h1>
          <p className="text-sm lg:text-base text-gray-500">Add working and present days for students</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              ADD WORKING/PRESENT DAYS
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                  <select 
                    value={form.examTypeId} 
                    onChange={(e) => setForm(p => ({ ...p, examTypeId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {examTypes.map((type: any) => (
                      <option key={type.id} value={type.id}>{type.exam_type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                  <select 
                    value={form.examNameId} 
                    onChange={(e) => setForm(p => ({ ...p, examNameId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {examNames.map((exam: any) => (
                      <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {searchLoading ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </div>
            </div>
          </div>

          {students.length > 0 && (
            <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Working Days</label>
                    <input 
                      type="number"
                      value={bulkData.workingDays}
                      onChange={(e) => setBulkData(prev => ({ ...prev, workingDays: e.target.value }))}
                      className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      placeholder="Enter working days"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Present Days</label>
                    <input 
                      type="number"
                      value={bulkData.presentDays}
                      onChange={(e) => setBulkData(prev => ({ ...prev, presentDays: e.target.value }))}
                      className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      placeholder="Enter present days"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Teacher Remarks</label>
                    <input 
                      type="text"
                      value={bulkData.teacherRemarks}
                      onChange={(e) => setBulkData(prev => ({ ...prev, teacherRemarks: e.target.value }))}
                      className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      placeholder="Enter remarks"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const newData = {};
                    students.forEach(student => {
                      newData[student.id] = {
                        workingDays: bulkData.workingDays,
                        presentDays: bulkData.presentDays,
                        teacherRemarks: bulkData.teacherRemarks
                      };
                    });
                    setStudentData(newData);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  FILL DATA IN GRID
                </button>
              </div>
            </div>
          )}

          {students.length > 0 && (
            <div className="bg-white border border-gray-300 mt-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Roll Number</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">firstname</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">lastname</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Batch</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Section</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Working Days</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Present Days</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student: any) => {
                      const data = studentData[student.id] || {};
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.roll_no}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.first_name}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.last_name}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.batches?.batch_no || ''}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.classes?.class_name || ''}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.sections?.section_name || ''}</td>
                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <input 
                              type="number" 
                              className="w-20 text-xs border-0 outline-0 bg-transparent text-center" 
                              placeholder="0" 
                              min="0"
                              value={data.workingDays || ''}
                              onChange={(e) => setStudentData(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], workingDays: e.target.value }
                              }))}
                            />
                          </td>
                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <input 
                              type="number" 
                              className="w-20 text-xs border-0 outline-0 bg-transparent text-center" 
                              placeholder="0" 
                              min="0"
                              value={data.presentDays || ''}
                              onChange={(e) => setStudentData(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], presentDays: e.target.value }
                              }))}
                            />
                          </td>
                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <input 
                              type="text" 
                              className="w-full text-xs border-0 outline-0 bg-transparent text-center px-2" 
                              placeholder="Remarks"
                              value={data.teacherRemarks || ''}
                              onChange={(e) => setStudentData(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], teacherRemarks: e.target.value }
                              }))}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4 flex justify-center">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-8 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (hasExistingData ? 'UPDATING...' : 'SAVING...') : (hasExistingData ? 'UPDATE' : 'SUBMIT')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWorkingPresentDays;
