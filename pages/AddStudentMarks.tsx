import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';

const AddStudentMarks: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    examTypeId: '',
    examNameId: ''
  });

  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examNames, setExamNames] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentMarks, setStudentMarks] = useState<{[key: string]: {theoryObtained: string, practicalObtained: string, creditHourThObtained: string, creditHourPrObtained: string}}>({});
  const [examMarks, setExamMarks] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasExistingMarks, setHasExistingMarks] = useState(false);
  const [selectedBatchName, setSelectedBatchName] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [selectedSectionName, setSelectedSectionName] = useState('');
  const [selectedSubjectName, setSelectedSubjectName] = useState('');

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadSubjects();
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
    if (form.schoolId && form.batchId && form.classId && form.sectionId) {
      loadSubjects();
    }
  }, [form.schoolId, form.batchId, form.classId, form.sectionId]);

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
    if (!error) {
      setBatches(data || []);
    }
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
    if (!error) {
      setClasses(data || []);
    }
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
    if (!error) {
      setSections(data || []);
    }
  };

  const loadSubjects = async () => {
    if (!form.schoolId) {
      setSubjects([]);
      return;
    }
    
    // If teacher, only load assigned subjects
    if (user.role === 'Teacher' && user.employee_id && form.batchId && form.classId && form.sectionId) {
      const { data: assignments } = await supabaseService.supabase
        .from('subject_teacher_assignments')
        .select('subject_id')
        .eq('school_id', form.schoolId)
        .eq('employee_id', user.employee_id)
        .eq('batch_id', form.batchId)
        .eq('class_id', form.classId)
        .eq('section_id', form.sectionId);
      
      if (assignments && assignments.length > 0) {
        const subjectIds = assignments.map(a => a.subject_id);
        const { data: subjectsData } = await supabaseService.supabase
          .from('subjects')
          .select('*')
          .in('id', subjectIds)
          .order('subject_name');
        setSubjects(subjectsData || []);
      } else {
        setSubjects([]);
      }
      return;
    }
    
    // For admin, load all subjects
    const { data, error } = await supabaseService.supabase
      .from('subjects')
      .select('*')
      .eq('school_id', form.schoolId)
      .order('subject_name');
    if (!error) setSubjects(data || []);
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

  const loadExamMarks = async () => {
    console.log('Loading exam marks with params:', {
      school_id: form.schoolId,
      class_id: form.classId,
      subject_id: form.subjectId,
      exam_type_id: form.examTypeId,
      exam_name_id: form.examNameId
    });
    
    const { data, error } = await supabaseService.supabase
      .from('exam_marks')
      .select('*')
      .eq('school_id', form.schoolId)
      .eq('class_id', form.classId)
      .eq('subject_id', form.subjectId)
      .eq('exam_type_id', form.examTypeId)
      .eq('exam_name_id', form.examNameId)
      .single();
    
    console.log('Exam marks result:', { data, error });
    
    if (!error && data) {
      console.log('Found exam marks:', data);
      setExamMarks(data);
    } else {
      console.log('No exam marks found or error:', error);
      setExamMarks(null);
    }
  };

  const handleSearch = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId) {
      alert('Please select School, Batch, Class, and Section');
      return;
    }
    setSearchLoading(true);
    await loadStudents();
    // Load exam marks if subject and exam details are selected
    if (form.subjectId && form.examTypeId && form.examNameId) {
      await loadExamMarks();
    }
    setSearchLoading(false);
  };

  const loadStudents = async () => {
    if (!user.school_id) return;
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
      loadExistingMarks(data || []);
      // Also get subject name from backend
      if (form.subjectId) {
        const { data: subjectData } = await supabaseService.supabase
          .from('subjects')
          .select('subject_name')
          .eq('id', form.subjectId)
          .single();
        if (subjectData) {
          setSelectedSubjectName(subjectData.subject_name);
        }
      }
    }
  };

  const loadExistingMarks = async (studentsList) => {
    if (!form.subjectId || !form.examTypeId || !form.examNameId) {
      setHasExistingMarks(false);
      setStudentMarks({});
      return;
    }
    
    const { data, error } = await supabaseService.supabase
      .from('student_marks')
      .select('*')
      .eq('school_id', form.schoolId)
      .eq('batch_id', form.batchId)
      .eq('class_id', form.classId)
      .eq('section_id', form.sectionId)
      .eq('subject_id', form.subjectId)
      .eq('exam_type_id', form.examTypeId)
      .eq('exam_name_id', form.examNameId);
    
    if (!error && data && data.length > 0) {
      const existingMarks = {};
      data.forEach(mark => {
        existingMarks[mark.student_id] = {
          theoryObtained: mark.theory_marks_obtained?.toString() || '',
          practicalObtained: mark.practical_marks_obtained?.toString() || '',
          creditHourThObtained: mark.credit_hour_th_obtained?.toString() || '',
          creditHourPrObtained: mark.credit_hour_pr_obtained?.toString() || ''
        };
      });
      setStudentMarks(existingMarks);
      setHasExistingMarks(true);
    } else {
      setStudentMarks({});
      setHasExistingMarks(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId || !form.subjectId || !form.examTypeId || !form.examNameId) {
      alert('Please fill all required fields');
      return;
    }

    const marksToSave = [];
    for (const student of students) {
      const marks = studentMarks[student.id] || {};
      if (marks.theoryObtained || marks.practicalObtained || marks.creditHourThObtained || marks.creditHourPrObtained) {
        const theoryTotal = examMarks?.th_marks || 100;
        const practicalTotal = examMarks?.pr_in_marks || 100;
        marksToSave.push({
          school_id: form.schoolId,
          batch_id: form.batchId,
          class_id: form.classId,
          section_id: form.sectionId,
          student_id: student.id,
          subject_id: form.subjectId,
          exam_type_id: form.examTypeId,
          exam_name_id: form.examNameId,
          theory_marks_obtained: parseFloat(marks.theoryObtained) || 0,
          theory_percentage: marks.theoryObtained ? ((parseFloat(marks.theoryObtained) / theoryTotal) * 100) : 0,
          practical_marks_obtained: parseFloat(marks.practicalObtained) || 0,
          practical_percentage: marks.practicalObtained ? ((parseFloat(marks.practicalObtained) / practicalTotal) * 100) : 0,
          credit_hour_th_obtained: parseFloat(marks.creditHourThObtained) || 0,
          credit_hour_pr_obtained: parseFloat(marks.creditHourPrObtained) || 0
        });
      }
    }

    if (marksToSave.length === 0) {
      alert('Please enter marks for at least one student');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseService.supabase
        .from('student_marks')
        .upsert(marksToSave, {
          onConflict: 'student_id,school_id,batch_id,class_id,section_id,exam_type_id,exam_name_id,subject_id'
        });
      
      if (error) {
        alert('Error saving marks: ' + error.message);
      } else {
        alert(hasExistingMarks ? 'Student marks updated successfully!' : 'Student marks saved successfully!');
        // Reload existing marks after save/update
        if (students.length > 0) {
          await loadExistingMarks(students);
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
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Add Students Marks</h1>
          <p className="text-sm lg:text-base text-gray-500">Add marks for students</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              ADD STUDENTS MARKS
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
                    onChange={(e) => {
                      const selectedBatch = batches.find(b => b.id === e.target.value);
                      setSelectedBatchName(selectedBatch?.batch_no || '');
                      setForm(p => ({ ...p, batchId: e.target.value }));
                    }}
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
                    onChange={(e) => {
                      const selectedClass = classes.find(c => c.id === e.target.value);
                      setSelectedClassName(selectedClass?.class_name || '');
                      setForm(p => ({ ...p, classId: e.target.value }));
                    }}
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
                    onChange={(e) => {
                      const selectedSection = sections.find(s => s.id === e.target.value);
                      setSelectedSectionName(selectedSection?.section_name || '');
                      setForm(p => ({ ...p, sectionId: e.target.value }));
                    }}
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
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject*</label>
                  <select 
                    value={form.subjectId} 
                    onChange={(e) => {
                      setForm(p => ({ ...p, subjectId: e.target.value }));
                      // Don't update selectedSubjectName here - only on search
                    }}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {subjects.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
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

          {/* Students Table */}
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
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Subject</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory Marks ({examMarks?.th_marks || 'N/A'})</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory Marks Obtained</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory % of marks</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Credit Hour (TH)</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Credit Hour (TH) Obtained</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical Marks ({examMarks?.pr_in_marks || 'N/A'})</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical Marks Obtained</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical % of marks</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Credit Hour (PR)</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Credit Hour (PR) Obtained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student: any) => {
                      const marks = studentMarks[student.id] || {};
                      const theoryTotal = examMarks?.th_marks || 100;
                      const practicalTotal = examMarks?.pr_in_marks || 100;
                      const theoryPercent = marks.theoryObtained ? ((parseFloat(marks.theoryObtained) / theoryTotal) * 100).toFixed(1) : '0';
                      const practicalPercent = marks.practicalObtained ? ((parseFloat(marks.practicalObtained) / practicalTotal) * 100).toFixed(1) : '0';
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.roll_no}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.first_name}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.last_name}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.batches?.batch_no || ''}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.classes?.class_name || ''}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.sections?.section_name || ''}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{selectedSubjectName || 'No Subject'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{examMarks?.th_marks || 0}</td>
                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <input 
                              type="number" 
                              className="w-16 text-xs border-0 outline-0 bg-transparent text-center" 
                              placeholder="0" 
                              min="0" 
                              max={examMarks?.th_marks || 100}
                              value={marks.theoryObtained || ''}
                              onChange={(e) => setStudentMarks(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], theoryObtained: e.target.value }
                              }))}
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{theoryPercent}%</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{examMarks?.credit_hour_th || 0}</td>
                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <input 
                              type="number" 
                              className="w-16 text-xs border-0 outline-0 bg-transparent text-center" 
                              placeholder="0" 
                              min="0" 
                              max={examMarks?.credit_hour_th || 100}
                              value={marks.creditHourThObtained || ''}
                              onChange={(e) => setStudentMarks(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], creditHourThObtained: e.target.value }
                              }))}
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{examMarks?.pr_in_marks || 0}</td>
                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <input 
                              type="number" 
                              className="w-16 text-xs border-0 outline-0 bg-transparent text-center" 
                              placeholder="0" 
                              min="0" 
                              max={examMarks?.pr_in_marks || 100}
                              value={marks.practicalObtained || ''}
                              onChange={(e) => setStudentMarks(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], practicalObtained: e.target.value }
                              }))}
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{practicalPercent}%</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{examMarks?.credit_hour_pr_in || 0}</td>
                          <td className="border border-gray-300 px-1 py-1 text-center">
                            <input 
                              type="number" 
                              className="w-16 text-xs border-0 outline-0 bg-transparent text-center" 
                              placeholder="0" 
                              min="0" 
                              max={examMarks?.credit_hour_pr_in || 100}
                              value={marks.creditHourPrObtained || ''}
                              onChange={(e) => setStudentMarks(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], creditHourPrObtained: e.target.value }
                              }))}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {form.subjectId && form.examTypeId && form.examNameId && (
                <div className="p-4 flex justify-center">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-8 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? (hasExistingMarks ? 'UPDATING...' : 'SAVING...') : (hasExistingMarks ? 'UPDATE' : 'SUBMIT')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentMarks;