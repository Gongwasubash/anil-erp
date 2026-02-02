import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors ${props.className || ''}`} />
);

const BlueBtn = ({ children, onClick, color = "bg-[#3498db]", disabled = false }: any) => (
  <button 
    type="button"
    onClick={onClick} 
    disabled={disabled}
    className={`${color} text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md`}
  >
    {children}
  </button>
);

const SectionBox = ({ children }: { children: React.ReactNode }) => (
  <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

const ViewStudentsTermMarks: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    examTypeId: '',
    examNameId: '',
    printDate: new Date().toISOString().split('T')[0]
  });

  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [examNames, setExamNames] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [examPercentages, setExamPercentages] = useState<any[]>([]);
  const [studentMarks, setStudentMarks] = useState<{[key: string]: {[key: string]: {[key: string]: number}}}>({});
  const [examMarks, setExamMarks] = useState<{[key: string]: {[key: string]: any}}>({});
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadSubjects();
    loadExamTypes();
  }, [user.school_id]);

  useEffect(() => {
    if (form.schoolId && form.examTypeId) {
      loadExamNames();
    } else {
      setExamNames([]);
      setForm(p => ({ ...p, examNameId: '' }));
    }
  }, [form.schoolId, form.batchId, form.classId, form.sectionId, form.examTypeId]);

  const loadSchools = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('schools')
          .select('*')
          .eq('id', user.school_id);
        if (!error && data) {
          setSchools(data);
          if (data.length > 0) {
            setForm(prev => ({ 
              ...prev, 
              schoolId: data[0].id
            }));
          }
        }
      }
    } catch (e) {
      console.error('Error loading schools:', e);
    }
  };

  const loadBatches = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('batches')
          .select('*')
          .eq('school_id', user.school_id)
          .order('batch_no');
        if (!error) setBatches(data || []);
      }
    } catch (e) {
      console.error('Error loading batches:', e);
    }
  };

  const loadClasses = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('classes')
          .select('*')
          .eq('school_id', user.school_id)
          .order('class_name');
        if (!error) setClasses(data || []);
      }
    } catch (e) {
      console.error('Error loading classes:', e);
    }
  };

  const loadSections = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('sections')
          .select('*')
          .eq('school_id', user.school_id)
          .order('section_name');
        if (!error) setSections(data || []);
      }
    } catch (e) {
      console.error('Error loading sections:', e);
    }
  };

  const loadSubjects = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('subjects')
          .select('*')
          .eq('school_id', user.school_id)
          .order('subject_name');
        if (!error) setSubjects(data || []);
      }
    } catch (e) {
      console.error('Error loading subjects:', e);
    }
  };

  const loadExamTypes = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('exam_types')
          .select('*')
          .eq('school_id', user.school_id);
        if (!error) setExamTypes(data || []);
      }
    } catch (e) {
      console.error('Error loading exam types:', e);
    }
  };

  const loadExamNames = async () => {
    try {
      if (form.schoolId && form.batchId && form.classId && form.sectionId && form.examTypeId) {
        const { data, error } = await supabaseService.supabase
          .from('final_exam_names')
          .select('*')
          .eq('school_id', form.schoolId)
          .eq('batch_id', form.batchId)
          .eq('class_id', form.classId)
          .eq('section_id', form.sectionId)
          .eq('exam_type_id', form.examTypeId);
        if (!error) setExamNames(data || []);
      } else if (form.schoolId && form.examTypeId) {
        const { data, error } = await supabaseService.supabase
          .from('final_exam_names')
          .select('*')
          .eq('school_id', form.schoolId)
          .eq('exam_type_id', form.examTypeId);
        if (!error) setExamNames(data || []);
      }
    } catch (e) {
      console.error('Error loading exam names:', e);
    }
  };

  const handleSearch = async () => {
    if (!form.schoolId || !form.examTypeId || !form.examNameId) {
      alert('Please fill School, Exam Type and Final Exam Name');
      return;
    }
    
    setLoading(true);
    setStudents([]);
    setStudentMarks({});
    setExamMarks({});
    
    try {
      const { data: percentages, error: percError } = await supabaseService.supabase
        .from('exam_percentages')
        .select('*')
        .eq('final_exam_name_id', form.examNameId)
        .order('order');
      
      if (percError) {
        alert('Error fetching exam percentages: ' + percError.message);
        return;
      }
      
      setExamPercentages(percentages || []);
      
      const batchData = batches.find(b => b.id == form.batchId);
      const classData = classes.find(c => c.id == form.classId);
      const sectionData = sections.find(s => s.id == form.sectionId);

      let query = supabaseService.supabase
        .from('students')
        .select('id, roll_no, first_name, last_name, batch_no, class, section')
        .eq('school_id', form.schoolId)
        .eq('batch_no', batchData?.batch_no)
        .eq('class', classData?.class_name);

      if (form.sectionId && sectionData) {
        query = query.eq('section', sectionData.section_name);
      }
      
      const { data, error } = await query.order('roll_no');

      if (error) {
        alert('Error fetching students: ' + error.message);
        return;
      }
      
      if (data && data.length > 0) {
        setStudents(data);
        
        if (percentages && percentages.length > 0) {
          const marksMap: {[key: string]: {[key: string]: {[key: string]: number}}} = {};
          
          // First, get the actual exam IDs from exam_names table
          const examNameMap: {[key: string]: string} = {};
          const examMarksMap: {[key: string]: {[key: string]: any}} = {};
          
          for (const perc of percentages) {
            const { data: examData } = await supabaseService.supabase
              .from('exam_names')
              .select('id')
              .eq('exam_name', perc.exam_name_id)
              .eq('school_id', form.schoolId)
              .eq('batch_id', form.batchId)
              .eq('class_id', form.classId)
              .eq('section_id', form.sectionId)
              .eq('exam_type_id', perc.exam_type_id)
              .maybeSingle();
            
            if (examData) {
              examNameMap[perc.exam_name_id] = examData.id;
            }
          }
          
          for (const subject of subjects) {
            examMarksMap[subject.id] = {};
            
            for (const perc of percentages) {
              const actualExamId = examNameMap[perc.exam_name_id];
              if (!actualExamId) continue;
              
              const { data: examMarkData } = await supabaseService.supabase
                .from('exam_marks')
                .select('*')
                .eq('school_id', form.schoolId)
                .eq('class_id', form.classId)
                .eq('subject_id', subject.id)
                .eq('exam_type_id', perc.exam_type_id)
                .eq('exam_name_id', actualExamId)
                .maybeSingle();
              
              if (examMarkData) {
                examMarksMap[subject.id][perc.exam_name_id] = examMarkData;
              }
            }
          }
          
          setExamMarks(examMarksMap);
          
          for (const student of data) {
            marksMap[student.id] = {};
            
            for (const subject of subjects) {
              marksMap[student.id][subject.id] = {};
              
              for (const perc of percentages) {
                const actualExamId = examNameMap[perc.exam_name_id];
                if (!actualExamId) continue;
                
                const { data: marksData } = await supabaseService.supabase
                  .from('student_marks')
                  .select('theory_marks_obtained, practical_marks_obtained')
                  .eq('student_id', student.id)
                  .eq('subject_id', subject.id)
                  .eq('exam_name_id', actualExamId)
                  .eq('exam_type_id', perc.exam_type_id)
                  .eq('school_id', form.schoolId)
                  .eq('batch_id', form.batchId)
                  .eq('class_id', form.classId)
                  .eq('section_id', form.sectionId)
                  .maybeSingle();
                
                if (marksData) {
                  const total = (marksData.theory_marks_obtained || 0) + (marksData.practical_marks_obtained || 0);
                  marksMap[student.id][subject.id][perc.exam_name_id] = total;
                }
              }
            }
          }
          
          setStudentMarks(marksMap);
        }
      } else {
        alert('No students found');
        setStudents([]);
      }
    } catch (err) {
      alert('Database connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleStudentSelect = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
    setSelectAll(newSelected.size === students.length);
  };

  const handlePrintMarksheet = () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student');
      return;
    }
    const printData = {
      students: students.filter(s => selectedStudents.has(s.id)),
      form,
      examPercentages,
      studentMarks,
      examMarks,
      subjects,
      examTypes,
      schools,
      batches,
      classes,
      sections,
      isTermMarksheet: true
    };
    sessionStorage.setItem('printMarksheetData', JSON.stringify(printData));
    window.open(`${window.location.origin}/#/all-term-students-marks`, '_blank');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">View Students Term Marks</h1>
          <p className="text-sm lg:text-base text-gray-500">View and manage student term examination marks</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              View Students Term Marks
            </h2>
            <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
          </div>

          <SectionBox>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                  <Input 
                    type="text" 
                    value={schools.find(s => s.id === form.schoolId)?.school_name || ''} 
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                  <select 
                    value={form.batchId} 
                    onChange={(e) => setForm(p => ({ ...p, batchId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {batches.map(batch => (
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
                    {classes.map(cls => (
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
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>{section.section_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <select 
                    value={form.subjectId} 
                    onChange={(e) => setForm(p => ({ ...p, subjectId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--Select Subject--</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type</label>
                  <select 
                    value={form.examTypeId} 
                    onChange={(e) => setForm(p => ({ ...p, examTypeId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {examTypes.map(examType => (
                      <option key={examType.id} value={examType.id}>{examType.exam_type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Final Exam Name</label>
                  <select 
                    value={form.examNameId} 
                    onChange={(e) => {
                      const selectedExam = examNames.find(ex => ex.id === e.target.value);
                      if (selectedExam) {
                        setForm(p => ({ 
                          ...p, 
                          examNameId: e.target.value,
                          batchId: String(selectedExam.batch_id),
                          classId: String(selectedExam.class_id),
                          sectionId: String(selectedExam.section_id)
                        }));
                      } else {
                        setForm(p => ({ ...p, examNameId: e.target.value }));
                      }
                    }}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {examNames.map(examName => (
                      <option key={examName.id} value={examName.id}>{examName.exam_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Print Date</label>
                <Input 
                  type="date" 
                  value={form.printDate}
                  onChange={(e) => setForm(p => ({ ...p, printDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
              <BlueBtn onClick={handleSearch} disabled={loading}>
                {loading ? 'LOADING...' : 'SEARCH'}
              </BlueBtn>
            </div>
          </SectionBox>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && students.length > 0 && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Selected: {selectedStudents.size} of {students.length}
                </div>
                <button 
                  onClick={handlePrintMarksheet}
                  disabled={selectedStudents.size === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Print Marksheet ({selectedStudents.size})
                </button>
              </div>
              <div className="bg-white border border-gray-300 mt-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4"
                        />
                      </th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Roll No.</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Student Name</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Batch</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Section</th>
                      {subjects.map(subject => (
                        <th key={subject.id} colSpan={examPercentages.length + 1} className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center bg-blue-100">
                          {subject.subject_name}
                        </th>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <th colSpan={7}></th>
                      {subjects.map(subject => (
                        <React.Fragment key={subject.id}>
                          {examPercentages.map((perc, idx) => (
                            <th key={`${subject.id}-${idx}`} className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">
                              {perc.exam_name_id}<br/>
                              {perc.exam_percentage}%
                            </th>
                          ))}
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center bg-blue-50">
                            Final %
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => {
                      const studentSubjectMarks = studentMarks[student.id] || {};
                      
                      return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedStudents.has(student.id)}
                            onChange={() => handleStudentSelect(student.id)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.roll_no}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">{student.first_name} {student.last_name}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.batch_no}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.class}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.section}</td>
                        {subjects.map(subject => {
                          const marks = studentSubjectMarks[subject.id] || {};
                          let finalPercentage = 0;
                          
                          examPercentages.forEach(perc => {
                            const mark = marks[perc.exam_name_id] || 0;
                            const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                            const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                            const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                            const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                            finalPercentage += weightedValue;
                          });
                          
                          return (
                            <React.Fragment key={subject.id}>
                              {examPercentages.map((perc, pIdx) => {
                                const mark = marks[perc.exam_name_id] || 0;
                                const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                                const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                                const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                                const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                                
                                return (
                                  <td key={pIdx} className="border border-gray-300 px-2 py-1 text-xs text-center">
                                    {mark > 0 ? (
                                      <div>
                                        <div>{actualPercentage.toFixed(2)}%</div>
                                        <div className="text-blue-600 font-bold">({weightedValue.toFixed(2)})</div>
                                      </div>
                                    ) : '-'}
                                  </td>
                                );
                              })}
                              <td className="border border-gray-300 px-2 py-1 text-xs text-center font-bold bg-blue-50">
                                {finalPercentage > 0 ? finalPercentage.toFixed(2) : '-'}
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentsTermMarks;
