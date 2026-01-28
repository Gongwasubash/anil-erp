import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { handlePrint } from '../utils/printUtils';

const ViewStudentsMarks: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    examTypeId: '',
    examNameId: '',
    printDate: ''
  });

  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examNames, setExamNames] = useState([]);
  const [studentMarks, setStudentMarks] = useState([]);
  const [examMarks, setExamMarks] = useState<any>(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState('');

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadExamTypes();
    loadGrades();
  }, [user.school_id]);

  useEffect(() => {
    loadSubjects();
  }, [user.school_id, form.batchId, form.classId, form.sectionId]);

  useEffect(() => {
    if (form.examTypeId) {
      loadExamNames();
    } else {
      setExamNames([]);
      setForm(p => ({ ...p, examNameId: '' }));
    }
  }, [user.school_id, form.examTypeId]);

  const loadSchools = async () => {
    const { data, error } = await supabaseService.getSchools();
    if (!error && user.school_id) {
      const userSchools = data?.filter(s => s.id === user.school_id) || [];
      setSchools(userSchools);
      setForm(prev => ({ ...prev, schoolId: user.school_id }));
    }
  };

  const loadBatches = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.supabase
      .from('batches')
      .select('*')
      .eq('school_id', user.school_id)
      .order('batch_no');
    if (!error) setBatches(data || []);
  };

  const loadClasses = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.supabase
      .from('classes')
      .select('*')
      .eq('school_id', user.school_id)
      .order('class_name');
    if (!error) setClasses(data || []);
  };

  const loadSections = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.supabase
      .from('sections')
      .select('*')
      .eq('school_id', user.school_id)
      .order('section_name');
    if (!error) setSections(data || []);
  };

  const loadSubjects = async () => {
    if (!user.school_id) {
      setSubjects([]);
      return;
    }
    
    // First try to load from subject_assignments if all fields are selected
    if (form.batchId && form.classId && form.sectionId) {
      const { data: assignmentData, error: assignmentError } = await supabaseService.supabase
        .from('subject_assignments')
        .select(`
          subject_id,
          subjects(id, subject_name)
        `)
        .eq('school_id', user.school_id)
        .eq('batch_id', form.batchId)
        .eq('class_id', form.classId)
        .eq('section_id', form.sectionId);
      
      if (!assignmentError && assignmentData && assignmentData.length > 0) {
        const subjectList = assignmentData.map(item => ({
          id: item.subjects.id,
          subject_name: item.subjects.subject_name
        }));
        setSubjects(subjectList);
        return;
      }
    }
    
    // Fallback: load all subjects for the school
    const { data, error } = await supabaseService.supabase
      .from('subjects')
      .select('id, subject_name')
      .eq('school_id', user.school_id)
      .order('subject_name');
    
    if (!error && data) {
      setSubjects(data);
    } else {
      setSubjects([]);
    }
  };

  const loadExamTypes = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.supabase
      .from('exam_types')
      .select('*')
      .eq('school_id', user.school_id);
    if (!error) setExamTypes(data || []);
  };

  const loadExamNames = async () => {
    if (!user.school_id || !form.examTypeId) return;
    const { data, error } = await supabaseService.supabase
      .from('exam_names')
      .select('*')
      .eq('school_id', user.school_id)
      .eq('exam_type_id', form.examTypeId);
    if (!error) setExamNames(data || []);
  };

  const loadGrades = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.supabase
      .from('grades')
      .select('*')
      .eq('school_id', user.school_id)
      .order('grade_point', { ascending: true });
    if (!error && data) {
      setGrades(data);
    } else {
      setGrades([]);
    }
  };

  const calculateGrade = (percentage: number) => {
    if (!grades || grades.length === 0) return { grade: 'N/A', gpa: '0.0' };
    const matchedGrade = grades.find(g => 
      percentage >= parseFloat(g.min_percent) && 
      percentage <= parseFloat(g.max_percent)
    );
    return matchedGrade ? { grade: matchedGrade.grade_name, gpa: matchedGrade.grade_point.toString() } : { grade: 'N/A', gpa: '0.0' };
  };

  const loadExamMarks = async (subjectId?: string) => {
    if (!form.schoolId || !form.classId || !form.examTypeId || !form.examNameId) return null;
    
    const targetSubjectId = subjectId || form.subjectId;
    if (!targetSubjectId) return null;
    
    const { data, error } = await supabaseService.supabase
      .from('exam_marks')
      .select('*')
      .eq('school_id', form.schoolId)
      .eq('class_id', form.classId)
      .eq('subject_id', targetSubjectId)
      .eq('exam_type_id', form.examTypeId)
      .eq('exam_name_id', form.examNameId)
      .single();
    
    if (!error && data) {
      return data;
    }
    return null;
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents(new Set());
    } else {
      const allStudentIds = new Set(studentMarks.map(student => student.student_id));
      setSelectedStudents(allStudentIds);
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
    setSelectAll(newSelected.size === studentMarks.length);
  };

  const handlePrintSelected = () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student to print');
      return;
    }
    
    const selectedStudentsData = Array.from(selectedStudents).map(studentId => 
      studentMarks.find(s => s.student_id === studentId)
    ).filter(Boolean);
    
    const printData = {
      students: selectedStudentsData,
      form: form,
      examMarks: examMarks,
      selectedSubjectName: selectedSubjectName,
      grades: grades
    };
    
    sessionStorage.setItem('printMarksheetData', JSON.stringify(printData));
    window.open(`${window.location.origin}/#/view-students-marks-module`, '_blank');
  };

  const handlePrint = (studentData: any) => {
    const printData = {
      student: studentData,
      form: form,
      examMarks: examMarks,
      selectedSubjectName: selectedSubjectName,
      grades: grades
    };
    
    sessionStorage.setItem('printMarksheetData', JSON.stringify(printData));
    window.open(`${window.location.origin}/#/view-students-marks-module`, '_blank');
  };

  const handleSearch = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId || !form.examTypeId || !form.examNameId) {
      alert('Please fill required fields (Subject is optional for full report)');
      return;
    }

    setLoading(true);
    try {
      // Load exam marks first if single subject selected
      let singleExamMarks = null;
      if (form.subjectId) {
        singleExamMarks = await loadExamMarks();
        setExamMarks(singleExamMarks);
      }
      
      // Build query - if subject is selected, filter by it, otherwise get all subjects
      let query = supabaseService.supabase
        .from('student_marks')
        .select('*')
        .eq('school_id', form.schoolId)
        .eq('batch_id', form.batchId)
        .eq('class_id', form.classId)
        .eq('section_id', form.sectionId)
        .eq('exam_type_id', form.examTypeId)
        .eq('exam_name_id', form.examNameId);
      
      if (form.subjectId) {
        query = query.eq('subject_id', form.subjectId);
      }

      const { data, error } = await query;

      if (!error && data) {
        // Get students data with class and section info
        const studentIds = [...new Set(data.map(mark => mark.student_id))];
        const { data: studentsData } = await supabaseService.supabase
          .from('students')
          .select(`
            id, roll_no, first_name, last_name, class_id, section_id,
            classes(class_name),
            sections(section_name)
          `)
          .in('id', studentIds);
        
        // Get subjects data and exam marks for each subject
        const subjectIds = [...new Set(data.map(mark => mark.subject_id))];
        const { data: subjectsData } = await supabaseService.supabase
          .from('subjects')
          .select('id, subject_name')
          .in('id', subjectIds);
        
        console.log('Subjects data loaded:', subjectsData);
        
        // Load exam marks for all subjects if multiple subjects
        const examMarksMap = {};
        if (!form.subjectId) {
          for (const subjectId of subjectIds) {
            const examMark = await loadExamMarks(subjectId);
            if (examMark) {
              examMarksMap[subjectId] = examMark;
            }
          }
        }

        // Group marks by student
        const studentMarksMap = {};
        data.forEach(mark => {
          if (!studentMarksMap[mark.student_id]) {
            const student = studentsData?.find(s => s.id === mark.student_id);
            studentMarksMap[mark.student_id] = {
              student_id: mark.student_id,
              student_name: student ? `${student.first_name} ${student.last_name}` : '',
              roll_no: student?.roll_no || '',
              class_name: student?.classes?.class_name || '',
              section_name: student?.sections?.section_name || '',
              batch_id: mark.batch_id,
              class_id: mark.class_id,
              section_id: mark.section_id,
              subjects: {},
              examMarks: examMarksMap
            };
          }
          
          const subject = subjectsData?.find(s => s.id === mark.subject_id);
          console.log(`Mapping subject ${mark.subject_id}:`, subject);
          studentMarksMap[mark.student_id].subjects[mark.subject_id] = {
            ...mark,
            subject_name: subject?.subject_name || `Subject ${mark.subject_id}`,
            exam_marks: examMarksMap[mark.subject_id] || null
          };
        });

        setStudentMarks(Object.values(studentMarksMap));
        
        // Get selected subject name if single subject is selected
        if (form.subjectId) {
          const { data: subjectData } = await supabaseService.supabase
            .from('subjects')
            .select('subject_name')
            .eq('id', form.subjectId)
            .single();
          if (subjectData) {
            setSelectedSubjectName(subjectData.subject_name);
          }
        } else {
          // For all subjects, load subject names for each subject ID
          const subjectNamesMap = {};
          for (const subjectId of subjectIds) {
            const { data: subjectData } = await supabaseService.supabase
              .from('subjects')
              .select('subject_name')
              .eq('id', subjectId)
              .single();
            if (subjectData) {
              subjectNamesMap[subjectId] = subjectData.subject_name;
            }
          }
          
          // Update student marks with correct subject names
          const updatedStudentMarks = Object.values(studentMarksMap).map(student => ({
            ...student,
            subjects: Object.keys(student.subjects).reduce((acc, subjectId) => {
              acc[subjectId] = {
                ...student.subjects[subjectId],
                subject_name: subjectNamesMap[subjectId] || `Subject ${subjectId}`
              };
              return acc;
            }, {})
          }));
          
          setStudentMarks(updatedStudentMarks);
        }
      } else {
        console.error('Error fetching student marks:', error);
        alert('Error fetching data: ' + error.message);
      }
    } catch (err) {
      console.error('Database error:', err);
      alert('Database connection error');
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">View Students Marks</h1>
          <p className="text-sm lg:text-base text-gray-500">View saved student marks</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              VIEW STUDENTS MARKS
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <select 
                    value={form.subjectId} 
                    onChange={(e) => setForm(p => ({ ...p, subjectId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- All Subjects ---</option>
                    {subjects.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Print Date</label>
                  <input 
                    type="date"
                    value={form.printDate}
                    onChange={(e) => setForm(p => ({ ...p, printDate: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Table */}
          {studentMarks.length > 0 && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <button 
                  onClick={handlePrintSelected}
                  disabled={selectedStudents.size === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Print Selected ({selectedStudents.size})
                </button>
              </div>
              <div className="bg-white border border-gray-300 mt-6 overflow-x-auto shadow-lg rounded-lg">
              <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>S.No</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>
                      <input 
                        type="checkbox" 
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>Print</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>Student Name</th>
                    {form.subjectId ? (
                      // Single subject view
                      <th className="border border-white px-0 py-0 text-sm font-semibold text-center" colSpan={4}>
                        <div className="border-b border-white px-2 py-2">{selectedSubjectName}</div>
                        <div className="grid grid-cols-4">
                          <div className="border-r border-white px-2 py-1 text-xs">TH</div>
                          <div className="border-r border-white px-2 py-1 text-xs">PR</div>
                          <div className="border-r border-white px-2 py-1 text-xs">TOT</div>
                          <div className="px-2 py-1 text-xs">GR</div>
                        </div>
                      </th>
                    ) : (
                      // Multiple subjects view - horizontal layout
                      studentMarks.length > 0 && Object.keys(studentMarks[0].subjects).map((subjectId) => {
                        const subjectData = studentMarks[0].subjects[subjectId];
                        return (
                          <th key={subjectId} className="border border-white px-0 py-0 text-sm font-semibold text-center" colSpan={5}>
                            <div className="border-b border-white px-2 py-2">{subjectData?.subject_name || `Subject ${subjectId}`}</div>
                            <div className="grid grid-cols-5">
                              <div className="border-r border-white px-2 py-1 text-xs">TH</div>
                              <div className="border-r border-white px-2 py-1 text-xs">PR</div>
                              <div className="border-r border-white px-2 py-1 text-xs">TOT</div>
                              <div className="border-r border-white px-2 py-1 text-xs">GR</div>
                              <div className="px-2 py-1 text-xs">GPA</div>
                            </div>
                          </th>
                        );
                      })
                    )}
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>Total</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>%</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>Grade</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>GPA</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>Result</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center" rowSpan={2}>Remarks</th>
                  </tr>
                  <tr className="bg-blue-700 text-white">
                    {form.subjectId ? (
                      // Single subject totals
                      <>
                        <th className="border border-white px-2 py-2 text-xs font-medium text-center">{examMarks?.th_marks || 'TH'}</th>
                        <th className="border border-white px-2 py-2 text-xs font-medium text-center">{examMarks?.pr_in_marks || 'PR'}</th>
                        <th className="border border-white px-2 py-2 text-xs font-medium text-center">{examMarks ? (examMarks.th_marks || 0) + (examMarks.pr_in_marks || 0) : 'TOT'}</th>
                        <th className="border border-white px-2 py-2 text-xs font-medium text-center"></th>
                      </>
                    ) : (
                      // Multiple subjects totals
                      studentMarks.length > 0 && Object.keys(studentMarks[0].subjects).map((subjectId) => {
                        const subjectData = studentMarks[0].subjects[subjectId];
                        const examMark = subjectData?.exam_marks;
                        return (
                          <React.Fragment key={`totals-${subjectId}`}>
                            <th className="border border-white px-2 py-2 text-xs font-medium text-center">{examMark?.th_marks || '0'}</th>
                            <th className="border border-white px-2 py-2 text-xs font-medium text-center">{examMark?.pr_in_marks || '0'}</th>
                            <th className="border border-white px-2 py-2 text-xs font-medium text-center">{examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : '0'}</th>
                            <th className="border border-white px-2 py-2 text-xs font-medium text-center"></th>
                            <th className="border border-white px-2 py-2 text-xs font-medium text-center"></th>
                          </React.Fragment>
                        );
                      })
                    )}
                  </tr>
                </thead>
                <tbody>
                    {studentMarks.map((studentData: any, index: number) => {
                      // If single subject selected, show one row per student
                      if (form.subjectId) {
                        const mark = Object.values(studentData.subjects)[0] as any;
                        const totalObtained = (mark?.theory_marks_obtained || 0) + (mark?.practical_marks_obtained || 0);
                        const totalPossible = (examMarks?.th_marks || 0) + (examMarks?.pr_in_marks || 0);
                        const overallPercent = totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : '0.0';
                        const gradeData = calculateGrade(parseFloat(overallPercent));
                        const grade = gradeData.grade;
                        const gpa = gradeData.gpa;
                        const result = parseFloat(overallPercent) >= 50 ? 'Pass' : 'Fail';
                        const remarks = parseFloat(overallPercent) >= 90 ? 'Excellent' : 
                                       parseFloat(overallPercent) >= 80 ? 'Very Good' : 
                                       parseFloat(overallPercent) >= 70 ? 'Good' : 
                                       parseFloat(overallPercent) >= 60 ? 'Satisfactory' : 
                                       parseFloat(overallPercent) >= 50 ? 'Acceptable' : 'Very Insufficient';
                        
                        return (
                          <tr key={studentData.student_id} className={`${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                            <td className="border border-gray-300 px-3 py-3 text-sm text-center font-medium">{index + 1}</td>
                            <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                              <input type="checkbox" className="w-4 h-4" />
                            </td>
                            <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                              <a href="#" className="text-blue-600 hover:underline cursor-pointer">Print</a>
                            </td>
                            <td className="border border-gray-300 px-3 py-3 text-sm">
                              <div className="font-bold uppercase text-gray-800">{studentData.student_name}</div>
                              <div className="text-xs text-gray-600 mt-1">Roll: {studentData.roll_no} | Class: {studentData.class_name} | Section: {studentData.section_name}</div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                              {mark?.theory_marks_obtained || 0} ({(() => {
                                const thPercent = examMarks?.th_marks > 0 ? ((mark?.theory_marks_obtained || 0) / examMarks.th_marks * 100).toFixed(1) : '0.0';
                                return calculateGrade(parseFloat(thPercent)).grade;
                              })()})
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                              {(examMarks?.pr_in_marks || 0) > 0 ? (
                                `${mark?.practical_marks_obtained || 0} (${(() => {
                                  const prPercent = ((mark?.practical_marks_obtained || 0) / examMarks.pr_in_marks * 100).toFixed(1);
                                  return calculateGrade(parseFloat(prPercent)).grade;
                                })()})`
                              ) : '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-medium">{totalObtained}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold text-blue-600">{grade}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-medium">{totalObtained}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold">{overallPercent}%</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold text-blue-600">{grade}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold text-purple-600">{gpa}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold">
                              <span className={parseFloat(overallPercent) >= 40 ? 'text-green-600' : 'text-red-600'}>
                                {parseFloat(overallPercent) >= 40 ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-sm">{(() => {
                              const totalGrade = calculateGrade(parseFloat(overallPercent));
                              const matchedGrade = grades.find(g => g.grade_name === totalGrade.grade);
                              return matchedGrade?.description || 'No remarks';
                            })()}</td>
                          </tr>
                        );
                      } else {
                        // Multiple subjects view - horizontal layout
                        const allSubjectMarks = Object.values(studentData.subjects);
                        const grandTotal = allSubjectMarks.reduce((sum: number, mark: any) => 
                          sum + (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0), 0);
                        const grandTotalPossible = allSubjectMarks.reduce((sum: number, mark: any) => {
                          const examMark = mark.exam_marks;
                          return sum + (examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 200);
                        }, 0);
                        const grandPercent = grandTotalPossible > 0 ? ((grandTotal / grandTotalPossible) * 100).toFixed(1) : '0.0';
                        const grandGradeData = calculateGrade(parseFloat(grandPercent));
                        
                        return (
                          <tr key={studentData.student_id} className={`${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                            <td className="border border-gray-300 px-3 py-3 text-sm text-center font-medium">{index + 1}</td>
                            <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedStudents.has(studentData.student_id)}
                                onChange={() => handleStudentSelect(studentData.student_id)}
                                className="w-4 h-4" 
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                              <a href="#" onClick={(e) => { e.preventDefault(); handlePrint(studentData); }} className="text-blue-600 hover:underline cursor-pointer">Print</a>
                            </td>
                            <td className="border border-gray-300 px-3 py-3 text-sm">
                              <div className="font-bold uppercase text-gray-800">{studentData.student_name}</div>
                              <div className="text-xs text-gray-600 mt-1">Roll: {studentData.roll_no} | Class: {studentData.class_name} | Section: {studentData.section_name}</div>
                            </td>
                            {Object.keys(studentData.subjects).map((subjectId) => {
                              const mark = studentData.subjects[subjectId];
                              const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
                              const examMark = mark.exam_marks;
                              const totalPossible = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 200;
                              const overallPercent = totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : '0.0';
                              const gradeData = calculateGrade(parseFloat(overallPercent));
                              
                              return (
                                <React.Fragment key={subjectId}>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                                    {mark.theory_marks_obtained || 0} ({(() => {
                                      const thPercent = examMark?.th_marks > 0 ? ((mark.theory_marks_obtained || 0) / examMark.th_marks * 100).toFixed(1) : '0.0';
                                      return calculateGrade(parseFloat(thPercent)).grade;
                                    })()})
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-center">
                                    {(examMark?.pr_in_marks || 0) > 0 ? (
                                      `${mark.practical_marks_obtained || 0} (${(() => {
                                        const prPercent = ((mark.practical_marks_obtained || 0) / examMark.pr_in_marks * 100).toFixed(1);
                                        return calculateGrade(parseFloat(prPercent)).grade;
                                      })()})`
                                    ) : '-'}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-center font-medium">{totalObtained}</td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold text-blue-600">{gradeData.grade}</td>
                                  <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold text-purple-600">{gradeData.gpa}</td>
                                </React.Fragment>
                              );
                            })}
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-medium">{grandTotal}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold">{grandPercent}%</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold text-blue-600">{grandGradeData.grade}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold text-purple-600">{grandGradeData.gpa}</td>
                            <td className="border border-gray-300 px-3 py-2 text-sm text-center font-bold">
                              <span className={parseFloat(grandPercent) >= 40 ? 'text-green-600' : 'text-red-600'}>
                                {parseFloat(grandPercent) >= 40 ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-sm">{(() => {
                              const matchedGrade = grades.find(g => g.grade_name === grandGradeData.grade);
                              return matchedGrade?.description || 'No remarks';
                            })()}</td>
                          </tr>
                        );
                      }
                    })}
                </tbody>
              </table>
            </div>
            </>
          )}

          {studentMarks.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>No student marks found. Please search with different criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentsMarks;