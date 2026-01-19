import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';

// UI Components
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

interface Grade {
  id: string;
  gradeName: string;
  minPercent: number;
  maxPercent: number;
  gradePoint: number;
  minGPoint: number;
  maxGPoint: number;
  description: string;
  teacherRemarks: string;
}

const Exams: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState(() => {
    const path = location.pathname;
    if (path.includes('manage_grade')) return 'manage_grade';
    if (path.includes('show_in_result')) return 'show_in_result';
    if (path.includes('exam_type')) return 'exam_type';
    if (path.includes('exam_name')) return 'exam_name';
    if (path.includes('add_exam_marks')) return 'add_exam_marks';
    if (path.includes('add_students_marks')) return 'add_students_marks';
    if (path.includes('view_students_marks')) return 'view_students_marks';
    return 'manage_grade';
  });

  const [gradeForm, setGradeForm] = useState({
    gradeName: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [addGradeForm, setAddGradeForm] = useState({
    gradeName: '',
    minPercent: '',
    maxPercent: '',
    gradePoint: '',
    minGPoint: '',
    maxGPoint: '',
    description: '',
    teacherRemarks: ''
  });

  const [gradesList, setGradesList] = useState<Grade[]>([]);
  const [editingGrade, setEditingGrade] = useState<any>(null);

  // Exam Type states
  const [examTypeForm, setExamTypeForm] = useState({ examType: '' });
  const [examTypesList, setExamTypesList] = useState<any[]>([]);
  const [showAddExamTypeForm, setShowAddExamTypeForm] = useState(false);
  const [editingExamType, setEditingExamType] = useState<any>(null);

  // Exam Name states
  const [examNameForm, setExamNameForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    examTypeId: '',
    examName: '',
    isCurrentExam: false
  });
  const [examNamesList, setExamNamesList] = useState<any[]>([]);
  const [showAddExamNameForm, setShowAddExamNameForm] = useState(false);
  const [editingExamName, setEditingExamName] = useState<any>(null);
  const [schoolsList, setSchoolsList] = useState<any[]>([]);
  const [batchesList, setBatchesList] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [sectionsList, setSectionsList] = useState<any[]>([]);

  // Add Exam Marks states
  const [addExamMarksForm, setAddExamMarksForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    examTypeId: '',
    examNameId: '',
    copySectionId: '',
    copyExamTypeId: '',
    copyExamNameId: ''
  });
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [subjectMarks, setSubjectMarks] = useState<{[key: string]: any}>({});
  // Add state to track existing exam marks IDs
  const [existingExamMarks, setExistingExamMarks] = useState<{[key: string]: string}>({});
  // Add Students Marks states
  const [addStudentsMarksForm, setAddStudentsMarksForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    examTypeId: '',
    examNameId: ''
  });
  const [studentsList, setStudentsList] = useState<any[]>([]);
  // Add exam marks students list
  const [examMarksStudentsList, setExamMarksStudentsList] = useState<any[]>([]);
  // Add state for student marks data
  const [subjectMarksData, setSubjectMarksData] = useState<any>(null);
  // View Students Marks states
  const [viewStudentsMarksForm, setViewStudentsMarksForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    examTypeId: '',
    examNameId: '',
    printDate: ''
  });
  const [viewStudentsList, setViewStudentsList] = useState<any[]>([]);
  const [viewSubjectMarksData, setViewSubjectMarksData] = useState<any>(null);
  const [viewAllSubjectsMarksData, setViewAllSubjectsMarksData] = useState<{[key: string]: any}>({});
  const [viewStudentMarks, setViewStudentMarks] = useState<{[key: string]: {theoryObtained: string, practicalObtained: string}}>({});
  const [studentMarks, setStudentMarks] = useState<{[key: string]: {theoryObtained: string, practicalObtained: string}}>({});

  const handleEditGrade = (grade: any) => {
    setAddGradeForm({
      gradeName: grade.grade_name || grade.gradeName || '',
      minPercent: (grade.min_percent !== undefined ? grade.min_percent : grade.minPercent || '').toString(),
      maxPercent: (grade.max_percent !== undefined ? grade.max_percent : grade.maxPercent || '').toString(),
      gradePoint: (grade.grade_point !== undefined ? grade.grade_point : grade.gradePoint || '').toString(),
      minGPoint: (grade.min_g_point !== undefined ? grade.min_g_point : grade.minGPoint || '').toString(),
      maxGPoint: (grade.max_g_point !== undefined ? grade.max_g_point : grade.maxGPoint || '').toString(),
      description: grade.description || '',
      teacherRemarks: grade.teacher_remarks || grade.teacherRemarks || ''
    });
    setEditingGrade(grade);
    setShowAddForm(true);
  };

  const handleDeleteGrade = async (gradeId: string) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;
    
    try {
      const { error } = await supabaseService.supabase
        .from('grades')
        .delete()
        .eq('id', gradeId);
        
      if (error) {
        console.error('Error deleting grade:', error);
        alert('Error deleting grade: ' + error.message);
      } else {
        alert('Grade deleted successfully!');
        fetchGrades();
      }
    } catch (err) {
      console.error('Database error:', err);
      alert('Database connection error');
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('manage_grade')) setActiveModule('manage_grade');
    if (path.includes('show_in_result')) setActiveModule('show_in_result');
    if (path.includes('exam_type')) setActiveModule('exam_type');
    if (path.includes('exam_name')) setActiveModule('exam_name');
    if (path.includes('add_exam_marks')) setActiveModule('add_exam_marks');
    if (path.includes('add_students_marks')) setActiveModule('add_students_marks');
    if (path.includes('view_students_marks')) setActiveModule('view_students_marks');
    fetchGrades();
    fetchExamTypes();
    fetchExamNames();
    fetchSchools();
    fetchBatches();
    fetchClasses();
    fetchSections();
    fetchSubjects();
  }, [location.pathname]);

  useEffect(() => {
    if (addStudentsMarksForm.schoolId && addStudentsMarksForm.batchId && addStudentsMarksForm.classId && addStudentsMarksForm.sectionId) {
      loadStudentsFromDatabase();
    }
    if (addStudentsMarksForm.schoolId && addStudentsMarksForm.batchId && addStudentsMarksForm.classId && addStudentsMarksForm.sectionId && addStudentsMarksForm.examTypeId && addStudentsMarksForm.examNameId && addStudentsMarksForm.subjectId) {
      loadSubjectMarksData();
      loadExistingStudentMarks();
    } else {
      setSubjectMarksData(null);
      setStudentMarks({});
    }
  }, [addStudentsMarksForm.schoolId, addStudentsMarksForm.batchId, addStudentsMarksForm.classId, addStudentsMarksForm.sectionId, addStudentsMarksForm.examTypeId, addStudentsMarksForm.examNameId, addStudentsMarksForm.subjectId]);

  useEffect(() => {
    if (viewStudentsMarksForm.schoolId && viewStudentsMarksForm.batchId && viewStudentsMarksForm.classId && viewStudentsMarksForm.sectionId) {
      loadViewStudentsFromDatabase();
    }
    if (viewStudentsMarksForm.schoolId && viewStudentsMarksForm.batchId && viewStudentsMarksForm.classId && viewStudentsMarksForm.sectionId && viewStudentsMarksForm.examTypeId && viewStudentsMarksForm.examNameId) {
      if (viewStudentsMarksForm.subjectId) {
        loadViewSubjectMarksData();
      } else {
        loadViewAllSubjectsMarksData();
      }
      loadViewExistingStudentMarks();
    } else {
      setViewSubjectMarksData(null);
      setViewAllSubjectsMarksData({});
      setViewStudentMarks({});
    }
  }, [viewStudentsMarksForm.schoolId, viewStudentsMarksForm.batchId, viewStudentsMarksForm.classId, viewStudentsMarksForm.sectionId, viewStudentsMarksForm.examTypeId, viewStudentsMarksForm.examNameId, viewStudentsMarksForm.subjectId]);

  // Auto-load students for exam marks when filters are applied
  useEffect(() => {
    if (addExamMarksForm.schoolId && addExamMarksForm.batchId && addExamMarksForm.classId && addExamMarksForm.sectionId) {
      loadExamMarksStudents();
    } else {
      setExamMarksStudentsList([]);
    }
  }, [addExamMarksForm.schoolId, addExamMarksForm.batchId, addExamMarksForm.classId, addExamMarksForm.sectionId]);

  const fetchExamTypes = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('exam_types').select('*');
      if (error) {
        console.error('Error fetching exam types:', error);
        setExamTypesList([
          { id: '1', exam_type: 'Unit Test 1' },
          { id: '2', exam_type: 'Unit Test 2' },
          { id: '3', exam_type: 'Mid Term Exam' },
          { id: '4', exam_type: 'Final Exam' },
          { id: '5', exam_type: 'Annual Exam' }
        ]);
      } else {
        setExamTypesList(data || []);
      }
    } catch (err) {
      console.error('Database connection error:', err);
    }
  };

  const handleEditExamType = (examType: any) => {
    setExamTypeForm({ examType: examType.exam_type });
    setEditingExamType(examType);
    setShowAddExamTypeForm(true);
  };

  const handleDeleteExamType = async (examTypeId: string) => {
    if (!window.confirm('Are you sure you want to delete this exam type?')) return;
    
    try {
      const { error } = await supabaseService.supabase
        .from('exam_types')
        .delete()
        .eq('id', examTypeId);
        
      if (error) {
        console.error('Error deleting exam type:', error);
        alert('Error deleting exam type: ' + error.message);
      } else {
        alert('Exam type deleted successfully!');
        fetchExamTypes();
      }
    } catch (err) {
      console.error('Database error:', err);
      alert('Database connection error');
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('schools').select('*');
      if (error) {
        setSchoolsList([{ id: '1', school_name: 'NORMAL MAX TEST ADMIN' }]);
      } else {
        setSchoolsList(data || []);
      }
    } catch (err) {
      setSchoolsList([{ id: '1', school_name: 'NORMAL MAX TEST ADMIN' }]);
    }
  };

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('batches').select('*');
      if (error) {
        setBatchesList([{ id: '1', batch_no: '2080' }]);
      } else {
        setBatchesList(data || []);
      }
    } catch (err) {
      setBatchesList([{ id: '1', batch_no: '2080' }]);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('classes').select('*');
      if (error) {
        setClassesList([
          { id: '1', class_name: 'Class 1' },
          { id: '2', class_name: 'Class 2' },
          { id: '3', class_name: 'Class 3' },
          { id: '4', class_name: 'Class 4' },
          { id: '5', class_name: 'Class 5' }
        ]);
      } else {
        setClassesList(data || []);
      }
    } catch (err) {
      setClassesList([{ id: '1', class_name: 'Class 1' }]);
    }
  };

  const fetchSections = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('sections').select('*');
      if (error) {
        setSectionsList([
          { id: '1', section_name: 'A' },
          { id: '2', section_name: 'B' },
          { id: '3', section_name: 'C' }
        ]);
      } else {
        setSectionsList(data || []);
      }
    } catch (err) {
      setSectionsList([{ id: '1', section_name: 'A' }]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('subjects').select('*').order('order_no', { ascending: true });
      if (error) {
        setSubjectsList([
          { id: '1', subject_code: 'ENG', subject_name: 'English', order_no: 1 },
          { id: '2', subject_code: 'NEP', subject_name: 'Nepali', order_no: 2 },
          { id: '3', subject_code: 'MAT', subject_name: 'Mathematics', order_no: 3 },
          { id: '4', subject_code: 'SCI', subject_name: 'Science', order_no: 4 },
          { id: '5', subject_code: 'SOC', subject_name: 'Social Studies', order_no: 5 },
          { id: '6', subject_code: 'HPE', subject_name: 'Health & Physical Education', order_no: 6 },
          { id: '7', subject_code: 'OPT', subject_name: 'Optional Mathematics', order_no: 7 },
          { id: '8', subject_code: 'COM', subject_name: 'Computer Science', order_no: 8 }
        ]);
      } else {
        setSubjectsList(data || []);
      }
    } catch (err) {
      setSubjectsList([]);
    }
  };

  const loadFilteredSubjects = () => {
    if (addExamMarksForm.schoolId && addExamMarksForm.batchId && addExamMarksForm.classId && addExamMarksForm.sectionId) {
      setFilteredSubjects(subjectsList);
    } else {
      setFilteredSubjects([]);
    }
  };

  // Auto-load subjects when all required fields are selected
  useEffect(() => {
    if (addExamMarksForm.schoolId && addExamMarksForm.batchId && addExamMarksForm.classId && addExamMarksForm.sectionId) {
      setFilteredSubjects(subjectsList);
      // Initialize subject marks state
      const initialMarks: {[key: string]: any} = {};
      subjectsList.forEach(subject => {
        initialMarks[subject.id] = {
          thMarks: '',
          passMarksTh: '',
          creditHourTh: '',
          prInMarks: '',
          passMarksPrIn: '',
          creditHourPrIn: ''
        };
      });
      setSubjectMarks(initialMarks);
      
      // Load existing exam marks if available
      loadExistingExamMarks();
    } else {
      setFilteredSubjects([]);
      setSubjectMarks({});
    }
  }, [addExamMarksForm.schoolId, addExamMarksForm.batchId, addExamMarksForm.classId, addExamMarksForm.sectionId, addExamMarksForm.examTypeId, addExamMarksForm.examNameId, subjectsList]);

  const handleSubjectMarkChange = (subjectId: string, field: string, value: string) => {
    setSubjectMarks(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value
      }
    }));
  };

  const loadExistingExamMarks = async () => {
    if (!addExamMarksForm.schoolId || !addExamMarksForm.batchId || !addExamMarksForm.classId || !addExamMarksForm.sectionId || !addExamMarksForm.examTypeId || !addExamMarksForm.examNameId) {
      return;
    }
    
    try {
      const { data, error } = await supabaseService.supabase
        .from('exam_marks')
        .select('*')
        .eq('school_id', addExamMarksForm.schoolId)
        .eq('batch_id', addExamMarksForm.batchId)
        .eq('class_id', addExamMarksForm.classId)
        .eq('section_id', addExamMarksForm.sectionId)
        .eq('exam_type_id', addExamMarksForm.examTypeId)
        .eq('exam_name_id', addExamMarksForm.examNameId);
        
      if (error) {
        console.error('Error loading exam marks:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const loadedMarks: {[key: string]: any} = {};
        const existingIds: {[key: string]: string} = {};
        
        data.forEach(mark => {
          loadedMarks[mark.subject_id] = {
            thMarks: mark.th_marks?.toString() || '',
            passMarksTh: mark.pass_marks_th?.toString() || '',
            creditHourTh: mark.credit_hour_th?.toString() || '',
            prInMarks: mark.pr_in_marks?.toString() || '',
            passMarksPrIn: mark.pass_marks_pr_in?.toString() || '',
            creditHourPrIn: mark.credit_hour_pr_in?.toString() || ''
          };
          existingIds[mark.subject_id] = mark.id;
        });
        
        setSubjectMarks(prev => ({ ...prev, ...loadedMarks }));
        setExistingExamMarks(existingIds);
      }
    } catch (err) {
      console.error('Error loading exam marks:', err);
    }
  };

  const fetchExamNames = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('exam_names').select('*');
      if (error) {
        console.error('Error fetching exam names:', error);
        setExamNamesList([
          { id: '1', school_id: '1', branch_id: '1', batch_no: '2080', class_id: '1', section_id: '1', exam_type_id: '1', exam_name: 'First Terminal Exam', is_current_exam: true },
          { id: '2', school_id: '1', branch_id: '1', batch_no: '2080', class_id: '2', section_id: '1', exam_type_id: '2', exam_name: 'Second Terminal Exam', is_current_exam: false }
        ]);
      } else {
        setExamNamesList(data || []);
      }
    } catch (err) {
      console.error('Database connection error:', err);
    }
  };

  const handleEditExamName = (examName: any) => {
    setExamNameForm({
      schoolId: examName.school_id || '',
      batchId: examName.batch_id || '',
      classId: examName.class_id || '',
      sectionId: examName.section_id || '',
      examTypeId: examName.exam_type_id || '',
      examName: examName.exam_name || '',
      isCurrentExam: examName.is_current_exam || false
    });
    setEditingExamName(examName);
    setShowAddExamNameForm(true);
  };

  const handleDeleteExamName = async (examNameId: string) => {
    if (!window.confirm('Are you sure you want to delete this exam name?')) return;
    
    try {
      const { error } = await supabaseService.supabase
        .from('exam_names')
        .delete()
        .eq('id', examNameId);
        
      if (error) {
        console.error('Error deleting exam name:', error);
        alert('Error deleting exam name: ' + error.message);
      } else {
        alert('Exam name deleted successfully!');
        fetchExamNames();
      }
    } catch (err) {
      console.error('Database error:', err);
      alert('Database connection error');
    }
  };

  const loadStudentsFromDatabase = async () => {
    if (!addStudentsMarksForm.schoolId || !addStudentsMarksForm.batchId || !addStudentsMarksForm.classId || !addStudentsMarksForm.sectionId) {
      setStudentsList([]);
      return;
    }
    
    try {
      const { data, error } = await supabaseService.supabase.from('students').select('*');
      if (error) {
        console.error('Error loading students:', error);
        setStudentsList([]);
      } else {
        let filtered = [...(data || [])];
        
        if (addStudentsMarksForm.schoolId) {
          const schoolName = schoolsList.find(s => String(s.id) === String(addStudentsMarksForm.schoolId))?.school_name;
          filtered = filtered.filter(s => {
            const studentSchool = s.school_id || s.schoolId || s.school || '';
            return String(studentSchool) === String(addStudentsMarksForm.schoolId) || 
                   String(studentSchool) === schoolName;
          });
        }
        
        if (addStudentsMarksForm.batchId) {
          const batchName = batchesList.find(b => String(b.id) === String(addStudentsMarksForm.batchId))?.batch_no;
          filtered = filtered.filter(s => {
            const studentBatch = s.batch_id || s.batchId || s.batch_no || s.batchNo || s.batch || '';
            return String(studentBatch) === String(addStudentsMarksForm.batchId) || 
                   String(studentBatch) === batchName;
          });
        }
        
        if (addStudentsMarksForm.classId) {
          const className = classesList.find(c => String(c.id) === String(addStudentsMarksForm.classId))?.class_name;
          filtered = filtered.filter(s => {
            const studentClass = s.class_id || s.classId || s.class || '';
            return String(studentClass) === String(addStudentsMarksForm.classId) || 
                   String(studentClass) === className;
          });
        }
        
        if (addStudentsMarksForm.sectionId) {
          const sectionName = sectionsList.find(s => String(s.id) === String(addStudentsMarksForm.sectionId))?.section_name;
          filtered = filtered.filter(s => {
            const studentSection = s.section_id || s.sectionId || s.section || '';
            return String(studentSection) === String(addStudentsMarksForm.sectionId) || 
                   String(studentSection) === sectionName;
          });
        }
        
        setStudentsList(filtered);
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setStudentsList([]);
    }
  };

  const loadExamMarksStudents = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('students')
        .select('*')
        .eq('school_id', addExamMarksForm.schoolId)
        .eq('batch_id', addExamMarksForm.batchId)
        .eq('class_id', addExamMarksForm.classId)
        .eq('section_id', addExamMarksForm.sectionId);
        
      if (error) {
        console.error('Error loading students:', error);
        setExamMarksStudentsList([]);
      } else {
        setExamMarksStudentsList(data || []);
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setExamMarksStudentsList([]);
    }
  };

  const loadSubjectMarksData = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('exam_marks')
        .select('*')
        .eq('school_id', addStudentsMarksForm.schoolId)
        .eq('batch_id', addStudentsMarksForm.batchId)
        .eq('class_id', addStudentsMarksForm.classId)
        .eq('section_id', addStudentsMarksForm.sectionId)
        .eq('exam_type_id', addStudentsMarksForm.examTypeId)
        .eq('exam_name_id', addStudentsMarksForm.examNameId)
        .eq('subject_id', addStudentsMarksForm.subjectId)
        .single();
        
      if (error) {
        console.error('Error loading subject marks:', error);
        setSubjectMarksData(null);
      } else {
        setSubjectMarksData(data);
      }
    } catch (err) {
      console.error('Error loading subject marks:', err);
      setSubjectMarksData(null);
    }
  };

  const handleStudentMarkChange = (studentId: string, field: string, value: string) => {
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const calculatePercentage = (obtained: string, total: number) => {
    const obtainedNum = parseFloat(obtained) || 0;
    if (total === 0) return '0';
    return ((obtainedNum / total) * 100).toFixed(2);
  };

  const loadExistingStudentMarks = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('student_marks')
        .select('*')
        .eq('school_id', addStudentsMarksForm.schoolId)
        .eq('batch_id', addStudentsMarksForm.batchId)
        .eq('class_id', addStudentsMarksForm.classId)
        .eq('section_id', addStudentsMarksForm.sectionId)
        .eq('exam_type_id', addStudentsMarksForm.examTypeId)
        .eq('exam_name_id', addStudentsMarksForm.examNameId)
        .eq('subject_id', addStudentsMarksForm.subjectId);
        
      if (error) {
        console.error('Error loading student marks:', error);
        setStudentMarks({});
      } else if (data && data.length > 0) {
        const loadedMarks: {[key: string]: {theoryObtained: string, practicalObtained: string}} = {};
        data.forEach(mark => {
          loadedMarks[mark.student_id] = {
            theoryObtained: mark.theory_marks_obtained?.toString() || '',
            practicalObtained: mark.practical_marks_obtained?.toString() || ''
          };
        });
        setStudentMarks(loadedMarks);
      } else {
        setStudentMarks({});
      }
    } catch (err) {
      console.error('Error loading student marks:', err);
      setStudentMarks({});
    }
  };

  const loadViewStudentsFromDatabase = async () => {
    if (!viewStudentsMarksForm.schoolId || !viewStudentsMarksForm.batchId || !viewStudentsMarksForm.classId || !viewStudentsMarksForm.sectionId) {
      setViewStudentsList([]);
      return;
    }
    
    try {
      const { data, error } = await supabaseService.supabase.from('students').select('*');
      if (error) {
        console.error('Error loading students:', error);
        setViewStudentsList([]);
      } else {
        let filtered = [...(data || [])];
        
        if (viewStudentsMarksForm.schoolId) {
          const schoolName = schoolsList.find(s => String(s.id) === String(viewStudentsMarksForm.schoolId))?.school_name;
          filtered = filtered.filter(s => {
            const studentSchool = s.school_id || s.schoolId || s.school || '';
            return String(studentSchool) === String(viewStudentsMarksForm.schoolId) || 
                   String(studentSchool) === schoolName;
          });
        }
        
        if (viewStudentsMarksForm.batchId) {
          const batchName = batchesList.find(b => String(b.id) === String(viewStudentsMarksForm.batchId))?.batch_no;
          filtered = filtered.filter(s => {
            const studentBatch = s.batch_id || s.batchId || s.batch_no || s.batchNo || s.batch || '';
            return String(studentBatch) === String(viewStudentsMarksForm.batchId) || 
                   String(studentBatch) === batchName;
          });
        }
        
        if (viewStudentsMarksForm.classId) {
          const className = classesList.find(c => String(c.id) === String(viewStudentsMarksForm.classId))?.class_name;
          filtered = filtered.filter(s => {
            const studentClass = s.class_id || s.classId || s.class || '';
            return String(studentClass) === String(viewStudentsMarksForm.classId) || 
                   String(studentClass) === className;
          });
        }
        
        if (viewStudentsMarksForm.sectionId) {
          const sectionName = sectionsList.find(s => String(s.id) === String(viewStudentsMarksForm.sectionId))?.section_name;
          filtered = filtered.filter(s => {
            const studentSection = s.section_id || s.sectionId || s.section || '';
            return String(studentSection) === String(viewStudentsMarksForm.sectionId) || 
                   String(studentSection) === sectionName;
          });
        }
        
        setViewStudentsList(filtered);
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setViewStudentsList([]);
    }
  };

  const loadViewSubjectMarksData = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('exam_marks')
        .select('*')
        .eq('school_id', viewStudentsMarksForm.schoolId)
        .eq('batch_id', viewStudentsMarksForm.batchId)
        .eq('class_id', viewStudentsMarksForm.classId)
        .eq('section_id', viewStudentsMarksForm.sectionId)
        .eq('exam_type_id', viewStudentsMarksForm.examTypeId)
        .eq('exam_name_id', viewStudentsMarksForm.examNameId)
        .eq('subject_id', viewStudentsMarksForm.subjectId)
        .single();
        
      if (error) {
        console.error('Error loading subject marks:', error);
        setViewSubjectMarksData(null);
      } else {
        setViewSubjectMarksData(data);
      }
    } catch (err) {
      console.error('Error loading subject marks:', err);
      setViewSubjectMarksData(null);
    }
  };

  const loadViewAllSubjectsMarksData = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('exam_marks')
        .select('*')
        .eq('school_id', viewStudentsMarksForm.schoolId)
        .eq('batch_id', viewStudentsMarksForm.batchId)
        .eq('class_id', viewStudentsMarksForm.classId)
        .eq('section_id', viewStudentsMarksForm.sectionId)
        .eq('exam_type_id', viewStudentsMarksForm.examTypeId)
        .eq('exam_name_id', viewStudentsMarksForm.examNameId);
        
      if (error) {
        console.error('Error loading all subjects marks:', error);
        setViewAllSubjectsMarksData({});
      } else if (data && data.length > 0) {
        const marksData: {[key: string]: any} = {};
        data.forEach(mark => {
          marksData[mark.subject_id] = mark;
        });
        setViewAllSubjectsMarksData(marksData);
      } else {
        setViewAllSubjectsMarksData({});
      }
    } catch (err) {
      console.error('Error loading all subjects marks:', err);
      setViewAllSubjectsMarksData({});
    }
  };

  const loadViewExistingStudentMarks = async () => {
    try {
      let query = supabaseService.supabase
        .from('student_marks')
        .select('*')
        .eq('school_id', viewStudentsMarksForm.schoolId)
        .eq('batch_id', viewStudentsMarksForm.batchId)
        .eq('class_id', viewStudentsMarksForm.classId)
        .eq('section_id', viewStudentsMarksForm.sectionId)
        .eq('exam_type_id', viewStudentsMarksForm.examTypeId)
        .eq('exam_name_id', viewStudentsMarksForm.examNameId);
        
      if (viewStudentsMarksForm.subjectId) {
        query = query.eq('subject_id', viewStudentsMarksForm.subjectId);
      }
      
      const { data, error } = await query;
        
      if (error) {
        console.error('Error loading student marks:', error);
        setViewStudentMarks({});
      } else if (data && data.length > 0) {
        const loadedMarks: {[key: string]: {theoryObtained: string, practicalObtained: string}} = {};
        data.forEach(mark => {
          const key = viewStudentsMarksForm.subjectId ? mark.student_id : `${mark.student_id}_${mark.subject_id}`;
          loadedMarks[key] = {
            theoryObtained: mark.theory_marks_obtained?.toString() || '',
            practicalObtained: mark.practical_marks_obtained?.toString() || ''
          };
        });
        setViewStudentMarks(loadedMarks);
      } else {
        setViewStudentMarks({});
      }
    } catch (err) {
      console.error('Error loading student marks:', err);
      setViewStudentMarks({});
    }
  };

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('grades').select('*');
      if (error) {
        console.error('Error fetching grades:', error);
        // Load default grades if database fails
        setGradesList([
          { id: '1', gradeName: 'E', minPercent: 0, maxPercent: 19.99, gradePoint: 0.8, minGPoint: 0, maxGPoint: 0.8, description: 'Very Insufficient', teacherRemarks: '' },
          { id: '2', gradeName: 'D', minPercent: 20, maxPercent: 29.99, gradePoint: 1.2, minGPoint: 0.81, maxGPoint: 1.2, description: 'Insufficient', teacherRemarks: '' },
          { id: '3', gradeName: 'D+', minPercent: 30, maxPercent: 39.99, gradePoint: 1.6, minGPoint: 1.21, maxGPoint: 1.6, description: 'Partially Acceptable', teacherRemarks: '' },
          { id: '4', gradeName: 'C', minPercent: 40, maxPercent: 49.99, gradePoint: 2, minGPoint: 1.61, maxGPoint: 2, description: 'Acceptable', teacherRemarks: '' },
          { id: '5', gradeName: 'C+', minPercent: 50, maxPercent: 59.99, gradePoint: 2.4, minGPoint: 2.01, maxGPoint: 2.4, description: 'Satisfactory', teacherRemarks: '' },
          { id: '6', gradeName: 'B', minPercent: 60, maxPercent: 69.99, gradePoint: 2.8, minGPoint: 2.41, maxGPoint: 2.8, description: 'Good', teacherRemarks: '' },
          { id: '7', gradeName: 'B+', minPercent: 70, maxPercent: 79.99, gradePoint: 3.2, minGPoint: 2.81, maxGPoint: 3.2, description: 'Very Good', teacherRemarks: '' },
          { id: '8', gradeName: 'A', minPercent: 80, maxPercent: 89.99, gradePoint: 3.6, minGPoint: 3.21, maxGPoint: 3.6, description: 'Excellent', teacherRemarks: '' },
          { id: '9', gradeName: 'A+', minPercent: 90, maxPercent: 100, gradePoint: 4, minGPoint: 3.61, maxGPoint: 4, description: 'Outstanding', teacherRemarks: '' }
        ]);
      } else {
        setGradesList(data || []);
      }
    } catch (err) {
      console.error('Database connection error:', err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Examination Management</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage grades, exams, marks and results</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {activeModule === 'exam_type' ? (
            <button 
              onClick={() => setShowAddExamTypeForm(true)}
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Add Exam Type
            </button>
          ) : activeModule === 'exam_name' ? (
            <button 
              onClick={() => setShowAddExamNameForm(true)}
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Add Exam Name
            </button>
          ) : (
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Add Grade
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          {showAddForm ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  {editingGrade ? 'Update Grade' : 'Add Grade'}
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Grade Name</label>
                      <Input 
                        value={addGradeForm.gradeName} 
                        onChange={(e) => setAddGradeForm(p => ({ ...p, gradeName: e.target.value }))}
                        placeholder="Enter grade name" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Percentage</label>
                      <Input 
                        type="number"
                        value={addGradeForm.minPercent} 
                        onChange={(e) => setAddGradeForm(p => ({ ...p, minPercent: e.target.value }))}
                        placeholder="Enter minimum percentage" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Maximum Percentage</label>
                      <Input 
                        type="number"
                        value={addGradeForm.maxPercent} 
                        onChange={(e) => setAddGradeForm(p => ({ ...p, maxPercent: e.target.value }))}
                        placeholder="Enter maximum percentage" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Grade Point</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={addGradeForm.gradePoint} 
                        onChange={(e) => setAddGradeForm(p => ({ ...p, gradePoint: e.target.value }))}
                        placeholder="Enter grade point" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Grade Point</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={addGradeForm.minGPoint} 
                        onChange={(e) => setAddGradeForm(p => ({ ...p, minGPoint: e.target.value }))}
                        placeholder="Enter minimum grade point" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Maximum Grade Point</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={addGradeForm.maxGPoint} 
                        onChange={(e) => setAddGradeForm(p => ({ ...p, maxGPoint: e.target.value }))}
                        placeholder="Enter maximum grade point" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Grade Description</label>
                    <Input 
                      value={addGradeForm.description} 
                      onChange={(e) => setAddGradeForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Enter grade description" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Teacher Remarks</label>
                    <Input 
                      value={addGradeForm.teacherRemarks} 
                      onChange={(e) => setAddGradeForm(p => ({ ...p, teacherRemarks: e.target.value }))}
                      placeholder="Enter teacher remarks" 
                    />
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn onClick={async () => {
                    try {
                      const gradeData = {
                        grade_name: addGradeForm.gradeName,
                        min_percent: parseFloat(addGradeForm.minPercent) || 0,
                        max_percent: parseFloat(addGradeForm.maxPercent) || 0,
                        grade_point: parseFloat(addGradeForm.gradePoint) || 0,
                        min_g_point: parseFloat(addGradeForm.minGPoint) || 0,
                        max_g_point: parseFloat(addGradeForm.maxGPoint) || 0,
                        description: addGradeForm.description,
                        teacher_remarks: addGradeForm.teacherRemarks
                      };
                      
                      if (editingGrade) {
                        // Update existing grade
                        const { error } = await supabaseService.supabase
                          .from('grades')
                          .update(gradeData)
                          .eq('id', editingGrade.id);
                          
                        if (error) {
                          console.error('Error updating grade:', error);
                          alert('Error updating grade: ' + error.message);
                        } else {
                          alert('Grade updated successfully!');
                          setShowAddForm(false);
                          setEditingGrade(null);
                          setAddGradeForm({
                            gradeName: '',
                            minPercent: '',
                            maxPercent: '',
                            gradePoint: '',
                            minGPoint: '',
                            maxGPoint: '',
                            description: '',
                            teacherRemarks: ''
                          });
                          fetchGrades();
                        }
                      } else {
                        // Create new grade
                        const { data, error } = await supabaseService.supabase
                          .from('grades')
                          .insert([gradeData])
                          .select();
                          
                        if (error) {
                          console.error('Error saving grade:', error);
                          alert('Error saving grade: ' + error.message);
                        } else {
                          alert('Grade saved successfully!');
                          setShowAddForm(false);
                          setAddGradeForm({
                            gradeName: '',
                            minPercent: '',
                            maxPercent: '',
                            gradePoint: '',
                            minGPoint: '',
                            maxGPoint: '',
                            description: '',
                            teacherRemarks: ''
                          });
                          fetchGrades();
                        }
                      }
                    } catch (err) {
                      console.error('Database error:', err);
                      alert('Database connection error');
                    }
                  }}>
                    {editingGrade ? 'UPDATE' : 'SUBMIT'}
                  </BlueBtn>
                  <BlueBtn onClick={() => {
                    setShowAddForm(false);
                    setEditingGrade(null);
                    setAddGradeForm({
                      gradeName: '',
                      minPercent: '',
                      maxPercent: '',
                      gradePoint: '',
                      minGPoint: '',
                      maxGPoint: '',
                      description: '',
                      teacherRemarks: ''
                    });
                  }} color="bg-gray-400">
                    CANCEL
                  </BlueBtn>
                </div>
              </SectionBox>
            </div>
          ) : activeModule === 'show_in_result' ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Show in Result
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="p-6 space-y-6">
                  {/* Display Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="displayType" value="marks" className="rounded" />
                        <span className="text-sm font-medium">Marks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="displayType" value="grade" className="rounded" />
                        <span className="text-sm font-medium">Grade</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="displayType" value="both" className="rounded" />
                        <span className="text-sm font-medium">Marks & Grades Both</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Percentage</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Division</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Rank in Section</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Rank in Class</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Out in Class</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-medium">Student Photo</span>
                      </label>
                    </div>
                  </div>

                  {/* Teacher's Remark Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-semibold mb-3">Teacher's Remark</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Working Days</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Remarks</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Show Teacher's Remark From:</label>
                        <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                          <option>Student Wise</option>
                          <option>Class Teacher</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Result Options */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-semibold mb-3">Result Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Remove Result</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Remove Pass Marks</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Remove Highest Marks</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Use Marksheet on Letter Head</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Remove Practical From Marksheet</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Remove AVERAGE GRADE</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Date and Signature Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-semibold mb-3">Date & Signature</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Date:</label>
                        <Input type="date" defaultValue="2021-03-10" />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">School Seal</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">Principal</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Subject Type Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-semibold mb-3">Subject Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">TH (Theory)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">PR (Practical)</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm font-medium">User Header In Result</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-semibold mb-3">Header File</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Header File:</label>
                      <input type="file" className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400" />
                      <p className="text-xs text-gray-500 mt-1">No file chosen</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn onClick={() => alert('Settings saved successfully!')}>
                    SAVE SETTINGS
                  </BlueBtn>
                  <BlueBtn color="bg-gray-400">
                    RESET
                  </BlueBtn>
                </div>
              </SectionBox>
            </div>
          ) : activeModule === 'exam_type' ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Exam Type
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              {showAddExamTypeForm ? (
                <SectionBox>
                  <div className="p-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type</label>
                      <Input 
                        value={examTypeForm.examType} 
                        onChange={(e) => setExamTypeForm({ examType: e.target.value })}
                        placeholder="Enter exam type" 
                      />
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                    <BlueBtn onClick={async () => {
                      try {
                        if (editingExamType) {
                          const { error } = await supabaseService.supabase
                            .from('exam_types')
                            .update({ exam_type: examTypeForm.examType })
                            .eq('id', editingExamType.id);
                            
                          if (error) {
                            alert('Error updating exam type: ' + error.message);
                          } else {
                            alert('Exam type updated successfully!');
                            setShowAddExamTypeForm(false);
                            setEditingExamType(null);
                            setExamTypeForm({ examType: '' });
                            fetchExamTypes();
                          }
                        } else {
                          const { error } = await supabaseService.supabase
                            .from('exam_types')
                            .insert([{ exam_type: examTypeForm.examType }]);
                            
                          if (error) {
                            alert('Error saving exam type: ' + error.message);
                          } else {
                            alert('Exam type saved successfully!');
                            setShowAddExamTypeForm(false);
                            setExamTypeForm({ examType: '' });
                            fetchExamTypes();
                          }
                        }
                      } catch (err) {
                        alert('Database connection error');
                      }
                    }}>
                      {editingExamType ? 'UPDATE' : 'SUBMIT'}
                    </BlueBtn>
                    <BlueBtn onClick={() => {
                      setShowAddExamTypeForm(false);
                      setEditingExamType(null);
                      setExamTypeForm({ examType: '' });
                    }} color="bg-gray-400">
                      CANCEL
                    </BlueBtn>
                  </div>
                </SectionBox>
              ) : (
                <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b">
                          <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sl No.</th>
                          <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Edit</th>
                          <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delete</th>
                          <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Exam Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {examTypesList.map((examType, idx) => (
                          <tr key={examType.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 lg:px-8 py-3 lg:py-5 text-center text-gray-500 font-bold">{idx + 1}</td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5">
                              <button onClick={() => handleEditExamType(examType)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all">
                                <Edit size={18} />
                              </button>
                            </td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5">
                              <button onClick={() => handleDeleteExamType(examType.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
                                <Trash2 size={18} />
                              </button>
                            </td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{examType.exam_type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activeModule === 'exam_name' ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Exam Name
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select 
                        value={examNameForm.schoolId} 
                        onChange={(e) => setExamNameForm(p => ({ ...p, schoolId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {schoolsList.map(school => (
                          <option key={school.id} value={school.id}>{school.school_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                      <select 
                        value={examNameForm.batchId} 
                        onChange={(e) => setExamNameForm(p => ({ ...p, batchId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {batchesList.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                      <select 
                        value={examNameForm.classId} 
                        onChange={(e) => setExamNameForm(p => ({ ...p, classId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {classesList.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                      <select 
                        value={examNameForm.sectionId} 
                        onChange={(e) => setExamNameForm(p => ({ ...p, sectionId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {sectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                      <select 
                        value={examNameForm.examTypeId} 
                        onChange={(e) => setExamNameForm(p => ({ ...p, examTypeId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                    <Input 
                      value={examNameForm.examName} 
                      onChange={(e) => setExamNameForm(p => ({ ...p, examName: e.target.value }))}
                      placeholder="Enter exam name" 
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={examNameForm.isCurrentExam}
                        onChange={(e) => setExamNameForm(p => ({ ...p, isCurrentExam: e.target.checked }))}
                        className="rounded" 
                      />
                      <span className="text-sm font-medium">Is Current Exam</span>
                    </label>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn onClick={async () => {
                    try {
                      const examData = {
                        school_id: examNameForm.schoolId,
                        batch_id: examNameForm.batchId,
                        class_id: examNameForm.classId,
                        section_id: examNameForm.sectionId,
                        exam_type_id: examNameForm.examTypeId,
                        exam_name: examNameForm.examName,
                        is_current_exam: examNameForm.isCurrentExam
                      };
                      
                      if (editingExamName) {
                        const { error } = await supabaseService.supabase
                          .from('exam_names')
                          .update(examData)
                          .eq('id', editingExamName.id);
                          
                        if (error) {
                          alert('Error updating exam name: ' + error.message);
                        } else {
                          alert('Exam name updated successfully!');
                          setShowAddExamNameForm(false);
                          setEditingExamName(null);
                          setExamNameForm({
                            schoolId: '',
                            batchId: '',
                            classId: '',
                            sectionId: '',
                            examTypeId: '',
                            examName: '',
                            isCurrentExam: false
                          });
                          fetchExamNames();
                        }
                      } else {
                        const { data, error } = await supabaseService.supabase
                          .from('exam_names')
                          .insert([examData])
                          .select();
                          
                        if (error) {
                          console.error('Error saving exam name:', error);
                          alert('Error saving exam name: ' + error.message);
                        } else {
                          console.log('Exam name saved:', data);
                          alert('Exam name saved successfully!');
                          setShowAddExamNameForm(false);
                          setExamNameForm({
                            schoolId: '',
                            batchId: '',
                            classId: '',
                            sectionId: '',
                            examTypeId: '',
                            examName: '',
                            isCurrentExam: false
                          });
                          fetchExamNames();
                        }
                      }
                    } catch (err) {
                      alert('Database connection error');
                    }
                  }}>
                    {editingExamName ? 'UPDATE' : 'SUBMIT'}
                  </BlueBtn>
                  <BlueBtn onClick={() => {
                    setShowAddExamNameForm(false);
                    setEditingExamName(null);
                    setExamNameForm({
                      schoolId: '',
                      batchId: '',
                      classId: '',
                      sectionId: '',
                      examTypeId: '',
                      examName: '',
                      isCurrentExam: false
                    });
                  }} color="bg-gray-400">
                    CANCEL
                  </BlueBtn>
                </div>
              </SectionBox>

              <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-white border-b">
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sl No.</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">School</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch No.</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Section</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Exam Type</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Exam Name</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Edit</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {examNamesList.map((examName, idx) => (
                        <tr key={examName.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-center text-gray-500 font-bold">{idx + 1}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{schoolsList.find(s => s.id === examName.school_id)?.school_name || 'NORMAL MAX TEST ADMIN'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{batchesList.find(b => b.id === examName.batch_id)?.batch_no || '2080'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">Class {examName.class_id}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{examName.section_id === '1' ? 'A' : examName.section_id === '2' ? 'B' : 'C'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{examTypesList.find(t => t.id === examName.exam_type_id)?.exam_type || 'Terminal'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{examName.exam_name}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button onClick={() => handleEditExamName(examName)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all">
                              <Edit size={18} />
                            </button>
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button onClick={() => handleDeleteExamName(examName.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeModule === 'add_exam_marks' ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Add Exam Marks
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select 
                        value={addExamMarksForm.schoolId} 
                        onChange={(e) => setAddExamMarksForm(p => ({ ...p, schoolId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {schoolsList.map(school => (
                          <option key={school.id} value={school.id}>{school.school_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                      <select 
                        value={addExamMarksForm.batchId} 
                        onChange={(e) => setAddExamMarksForm(p => ({ ...p, batchId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {batchesList.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                      <select 
                        value={addExamMarksForm.classId} 
                        onChange={(e) => setAddExamMarksForm(p => ({ ...p, classId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {classesList.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                      <select 
                        value={addExamMarksForm.sectionId} 
                        onChange={(e) => setAddExamMarksForm(p => ({ ...p, sectionId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">-----Select-----</option>
                        {sectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                      <select 
                        value={addExamMarksForm.examTypeId} 
                        onChange={(e) => setAddExamMarksForm(p => ({ ...p, examTypeId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                      <select 
                        value={addExamMarksForm.examNameId} 
                        onChange={(e) => setAddExamMarksForm(p => ({ ...p, examNameId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examNamesList.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </SectionBox>

              {/* Students Table */}
              {examMarksStudentsList.length > 0 && (
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
                        </tr>
                      </thead>
                      <tbody>
                        {examMarksStudentsList.map((student, idx) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.roll_number || idx + 1}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs">{student.first_name}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs">{student.last_name}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{batchesList.find(b => b.id === student.batch_id)?.batch_no || '2080'}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{classesList.find(c => c.id === student.class_id)?.class_name || 'Class 1'}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{sectionsList.find(s => s.id === student.section_id)?.section_name || 'A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subjects Table */}
              {filteredSubjects.length > 0 && (
                <div className="bg-white border border-gray-300 mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-12">Sl No.</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-20">Subject Code</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-40">Subject Name</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-20">TH Marks</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-24">Pass Marks TH</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-28">Credit Hour (TH)</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-24">PR/IN Marks</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-28">Pass Marks PR/IN</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center w-32">Credit Hour (PR/IN)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubjects.map((subject, idx) => (
                          <tr key={subject.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{subject.subject_code}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs">{subject.subject_name}</td>
                            <td className="border border-gray-300 px-1 py-1">
                              <input 
                                type="number" 
                                value={subjectMarks[subject.id]?.thMarks || ''}
                                onChange={(e) => handleSubjectMarkChange(subject.id, 'thMarks', e.target.value)}
                                className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                                placeholder="0" 
                              />
                            </td>
                            <td className="border border-gray-300 px-1 py-1">
                              <input 
                                type="number" 
                                value={subjectMarks[subject.id]?.passMarksTh || ''}
                                onChange={(e) => handleSubjectMarkChange(subject.id, 'passMarksTh', e.target.value)}
                                className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                                placeholder="0" 
                              />
                            </td>
                            <td className="border border-gray-300 px-1 py-1">
                              <input 
                                type="number" 
                                value={subjectMarks[subject.id]?.creditHourTh || ''}
                                onChange={(e) => handleSubjectMarkChange(subject.id, 'creditHourTh', e.target.value)}
                                className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                                placeholder="0" 
                              />
                            </td>
                            <td className="border border-gray-300 px-1 py-1">
                              <input 
                                type="number" 
                                value={subjectMarks[subject.id]?.prInMarks || ''}
                                onChange={(e) => handleSubjectMarkChange(subject.id, 'prInMarks', e.target.value)}
                                className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                                placeholder="0" 
                              />
                            </td>
                            <td className="border border-gray-300 px-1 py-1">
                              <input 
                                type="number" 
                                value={subjectMarks[subject.id]?.passMarksPrIn || ''}
                                onChange={(e) => handleSubjectMarkChange(subject.id, 'passMarksPrIn', e.target.value)}
                                className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                                placeholder="0" 
                              />
                            </td>
                            <td className="border border-gray-300 px-1 py-1">
                              <input 
                                type="number" 
                                value={subjectMarks[subject.id]?.creditHourPrIn || ''}
                                onChange={(e) => handleSubjectMarkChange(subject.id, 'creditHourPrIn', e.target.value)}
                                className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                                placeholder="0" 
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Copy Same Data To Section - Moved Below Table */}
                  <div className="border-t p-6">
                    <h3 className="text-md font-semibold mb-3">Copy Same Data To:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                        <select 
                          value={addExamMarksForm.copySectionId} 
                          onChange={(e) => setAddExamMarksForm(p => ({ ...p, copySectionId: e.target.value }))}
                          className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                        >
                          <option value="">-----Select-----</option>
                          {sectionsList.map(section => (
                            <option key={section.id} value={section.id}>{section.section_name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                        <select 
                          value={addExamMarksForm.copyExamTypeId} 
                          onChange={(e) => setAddExamMarksForm(p => ({ ...p, copyExamTypeId: e.target.value }))}
                          className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                        >
                          <option value="">--- Select ---</option>
                          {examTypesList.map(type => (
                            <option key={type.id} value={type.id}>{type.exam_type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                        <select 
                          value={addExamMarksForm.copyExamNameId} 
                          onChange={(e) => setAddExamMarksForm(p => ({ ...p, copyExamNameId: e.target.value }))}
                          className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                        >
                          <option value="">--- Select ---</option>
                          {examNamesList.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                      <BlueBtn onClick={async () => {
                        try {
                          // Prepare exam marks data for database
                          const examMarksData = [];
                          const updatePromises = [];
                          
                          for (const subject of filteredSubjects) {
                            const marks = subjectMarks[subject.id];
                            if (marks && (marks.thMarks || marks.passMarksTh || marks.creditHourTh || marks.prInMarks || marks.passMarksPrIn || marks.creditHourPrIn)) {
                              const markData = {
                                school_id: addExamMarksForm.schoolId,
                                batch_id: addExamMarksForm.batchId,
                                class_id: addExamMarksForm.classId,
                                section_id: addExamMarksForm.sectionId,
                                exam_type_id: addExamMarksForm.examTypeId,
                                exam_name_id: addExamMarksForm.examNameId,
                                subject_id: subject.id,
                                subject_code: subject.subject_code,
                                subject_name: subject.subject_name,
                                th_marks: parseFloat(marks.thMarks) || 0,
                                pass_marks_th: parseFloat(marks.passMarksTh) || 0,
                                credit_hour_th: parseFloat(marks.creditHourTh) || 0,
                                pr_in_marks: parseFloat(marks.prInMarks) || 0,
                                pass_marks_pr_in: parseFloat(marks.passMarksPrIn) || 0,
                                credit_hour_pr_in: parseFloat(marks.creditHourPrIn) || 0
                              };
                              
                              // Check if record exists for this subject
                              if (existingExamMarks[subject.id]) {
                                // Update existing record
                                updatePromises.push(
                                  supabaseService.supabase
                                    .from('exam_marks')
                                    .update(markData)
                                    .eq('id', existingExamMarks[subject.id])
                                );
                              } else {
                                // Create new record
                                examMarksData.push(markData);
                              }
                            }
                          }
                          
                          if (examMarksData.length === 0 && updatePromises.length === 0) {
                            alert('Please enter at least one mark value before submitting.');
                            return;
                          }
                          
                          // Execute updates
                          if (updatePromises.length > 0) {
                            const updateResults = await Promise.all(updatePromises);
                            const updateErrors = updateResults.filter(result => result.error);
                            if (updateErrors.length > 0) {
                              console.error('Update errors:', updateErrors);
                              alert('Error updating some records');
                              return;
                            }
                          }
                          
                          // Execute inserts
                          if (examMarksData.length > 0) {
                            const { data, error } = await supabaseService.createExamMarks(examMarksData);
                            if (error) {
                              console.error('Error saving exam marks:', error);
                              if (error.message.includes('exam_marks')) {
                                alert('Database table not found. Please run the exam-marks-table.sql script in your Supabase SQL editor first.');
                              } else {
                                alert('Error saving exam marks: ' + error.message);
                              }
                              return;
                            }
                          }
                          
                          alert(`Successfully saved/updated exam marks!`);
                          
                          // Reload the data to get updated values
                          loadExistingExamMarks();
                        } catch (err) {
                          console.error('Database error:', err);
                          alert('Database connection error');
                        }
                      }}>
                        SUBMIT
                      </BlueBtn>
                      <BlueBtn onClick={() => {
                        setAddExamMarksForm(p => ({
                          ...p,
                          copySectionId: '',
                          copyExamTypeId: '',
                          copyExamNameId: ''
                        }));
                      }} color="bg-gray-400">
                        CANCEL
                      </BlueBtn>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeModule === 'add_students_marks' ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Add Students Marks
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select 
                        value={addStudentsMarksForm.schoolId}
                        onChange={(e) => setAddStudentsMarksForm(p => ({ ...p, schoolId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {schoolsList.map(school => (
                          <option key={school.id} value={school.id}>{school.school_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                      <select 
                        value={addStudentsMarksForm.batchId}
                        onChange={(e) => setAddStudentsMarksForm(p => ({ ...p, batchId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {batchesList.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                      <select 
                        value={addStudentsMarksForm.classId}
                        onChange={(e) => setAddStudentsMarksForm(p => ({ ...p, classId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {classesList.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                      <select 
                        value={addStudentsMarksForm.sectionId}
                        onChange={(e) => setAddStudentsMarksForm(p => ({ ...p, sectionId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {sectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                      <select 
                        value={addStudentsMarksForm.examTypeId}
                        onChange={(e) => setAddStudentsMarksForm(p => ({ ...p, examTypeId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                      <select 
                        value={addStudentsMarksForm.examNameId}
                        onChange={(e) => setAddStudentsMarksForm(p => ({ ...p, examNameId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examNamesList.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject*</label>
                      <select 
                        value={addStudentsMarksForm.subjectId}
                        onChange={(e) => setAddStudentsMarksForm(p => ({ ...p, subjectId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {subjectsList.map(subject => (
                          <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </SectionBox>

              {addStudentsMarksForm.schoolId && addStudentsMarksForm.batchId && addStudentsMarksForm.classId && addStudentsMarksForm.sectionId && (
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
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory Marks ({subjectMarksData?.th_marks || 0})</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory Marks Obtained</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory % of marks</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical Marks ({subjectMarksData?.pr_in_marks || 0})</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical Marks Obtained</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical % of marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsList.length > 0 ? studentsList.map((student, idx) => {
                          const theoryObtained = studentMarks[student.id]?.theoryObtained || '';
                          const practicalObtained = studentMarks[student.id]?.practicalObtained || '';
                          const theoryPercentage = calculatePercentage(theoryObtained, subjectMarksData?.th_marks || 0);
                          const practicalPercentage = calculatePercentage(practicalObtained, subjectMarksData?.pr_in_marks || 0);
                          
                          return (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.roll_no || student.roll_number || idx + 1}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs">{student.first_name}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs">{student.last_name}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.batch_no || batchesList.find(b => b.id === addStudentsMarksForm.batchId)?.batch_no}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.class || classesList.find(c => c.id === addStudentsMarksForm.classId)?.class_name}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{student.section || sectionsList.find(s => s.id === addStudentsMarksForm.sectionId)?.section_name}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subjectMarksData?.th_marks || 0}</td>
                            <td className="border border-gray-300 px-1 py-1"><input type="number" value={theoryObtained} onChange={(e) => handleStudentMarkChange(student.id, 'theoryObtained', e.target.value)} className="w-full text-xs border-0 outline-0 bg-transparent text-center" placeholder="0" /></td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{theoryPercentage}%</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subjectMarksData?.pr_in_marks || 0}</td>
                            <td className="border border-gray-300 px-1 py-1"><input type="number" value={practicalObtained} onChange={(e) => handleStudentMarkChange(student.id, 'practicalObtained', e.target.value)} className="w-full text-xs border-0 outline-0 bg-transparent text-center" placeholder="0" /></td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{practicalPercentage}%</td>
                          </tr>
                        )}) : (
                          <tr>
                            <td colSpan={12} className="border border-gray-300 px-2 py-4 text-xs text-center text-gray-500">No students found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                    <BlueBtn onClick={async () => {
                      try {
                        const studentMarksData = [];
                        
                        for (const student of studentsList) {
                          const marks = studentMarks[student.id];
                          if (marks && (marks.theoryObtained || marks.practicalObtained)) {
                            const theoryObtained = parseFloat(marks.theoryObtained) || 0;
                            const practicalObtained = parseFloat(marks.practicalObtained) || 0;
                            const theoryPercentage = parseFloat(calculatePercentage(marks.theoryObtained, subjectMarksData?.th_marks || 0));
                            const practicalPercentage = parseFloat(calculatePercentage(marks.practicalObtained, subjectMarksData?.pr_in_marks || 0));
                            
                            studentMarksData.push({
                              student_id: student.id,
                              school_id: addStudentsMarksForm.schoolId,
                              batch_id: addStudentsMarksForm.batchId,
                              class_id: addStudentsMarksForm.classId,
                              section_id: addStudentsMarksForm.sectionId,
                              exam_type_id: addStudentsMarksForm.examTypeId,
                              exam_name_id: addStudentsMarksForm.examNameId,
                              subject_id: addStudentsMarksForm.subjectId,
                              theory_marks_obtained: theoryObtained,
                              theory_percentage: theoryPercentage,
                              practical_marks_obtained: practicalObtained,
                              practical_percentage: practicalPercentage
                            });
                          }
                        }
                        
                        if (studentMarksData.length === 0) {
                          alert('Please enter marks for at least one student.');
                          return;
                        }
                        
                        const { data, error } = await supabaseService.supabase
                          .from('student_marks')
                          .upsert(studentMarksData, {
                            onConflict: 'student_id,school_id,batch_id,class_id,section_id,exam_type_id,exam_name_id,subject_id',
                            ignoreDuplicates: false
                          });
                          
                        if (error) {
                          console.error('Error saving student marks:', error);
                          alert('Error saving student marks: ' + error.message);
                        } else {
                          alert('Student marks saved successfully!');
                          loadExistingStudentMarks();
                        }
                      } catch (err) {
                        console.error('Database error:', err);
                        alert('Database connection error');
                      }
                    }}>
                      SUBMIT
                    </BlueBtn>
                  </div>
                </div>
              )}
            </div>
          ) : activeModule === 'view_students_marks' ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  View Students Marks
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select 
                        value={viewStudentsMarksForm.schoolId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, schoolId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {schoolsList.map(school => (
                          <option key={school.id} value={school.id}>{school.school_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                      <select 
                        value={viewStudentsMarksForm.batchId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, batchId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {batchesList.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                      <select 
                        value={viewStudentsMarksForm.classId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, classId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {classesList.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                      <select 
                        value={viewStudentsMarksForm.sectionId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, sectionId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {sectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject*</label>
                      <select 
                        value={viewStudentsMarksForm.subjectId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, subjectId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {subjectsList.map(subject => (
                          <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                      <select 
                        value={viewStudentsMarksForm.examTypeId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, examTypeId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                      <select 
                        value={viewStudentsMarksForm.examNameId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, examNameId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examNamesList.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Print Date</label>
                    <Input 
                      type="date" 
                      value={viewStudentsMarksForm.printDate}
                      onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, printDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn onClick={() => {
                    if (viewStudentsMarksForm.schoolId && viewStudentsMarksForm.batchId && viewStudentsMarksForm.classId && viewStudentsMarksForm.sectionId) {
                      loadViewStudentsFromDatabase();
                      if (viewStudentsMarksForm.subjectId && viewStudentsMarksForm.examTypeId && viewStudentsMarksForm.examNameId) {
                        loadViewSubjectMarksData();
                        loadViewExistingStudentMarks();
                      } else if (viewStudentsMarksForm.examTypeId && viewStudentsMarksForm.examNameId) {
                        loadViewAllSubjectsMarksData();
                        loadViewExistingStudentMarks();
                      }
                    }
                  }}>
                    SEARCH
                  </BlueBtn>
                </div>
              </SectionBox>

              {viewStudentsList.length > 0 && (
                <div className="bg-white border border-gray-300 mt-6">
                  <div className="overflow-x-auto">
                    {viewStudentsMarksForm.subjectId ? (
                      // Single subject table
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-blue-600 text-white">
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">S.No</th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">Print</th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">Student Name</th>
                            <th colSpan={4} className="border border-gray-300 px-3 py-2 text-xs font-bold">
                              {viewSubjectMarksData ? 
                                `${viewSubjectMarksData.subject_name} (${viewSubjectMarksData.subject_code})` : 
                                'Subject'
                              }
                            </th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">Total</th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">%</th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">Grade</th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">GPA</th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">Result</th>
                            <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-xs font-bold">Remarks</th>
                          </tr>
                          <tr className="bg-blue-600 text-white">
                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold">TH</th>
                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold">PR</th>
                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold">TOT</th>
                            <th className="border border-gray-300 px-3 py-2 text-xs font-bold">GR</th>
                          </tr>
                          <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-3 py-2 text-xs">{viewSubjectMarksData?.th_marks || 0}</th>
                            <th className="border border-gray-300 px-3 py-2 text-xs">{viewSubjectMarksData?.pr_in_marks || 0}</th>
                            <th className="border border-gray-300 px-3 py-2 text-xs">{(viewSubjectMarksData?.th_marks || 0) + (viewSubjectMarksData?.pr_in_marks || 0)}</th>
                            <th className="border border-gray-300 px-3 py-2 text-xs"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewStudentsList.map((student, idx) => {
                            const theoryObtained = parseFloat(viewStudentMarks[student.id]?.theoryObtained || '0');
                            const practicalObtained = parseFloat(viewStudentMarks[student.id]?.practicalObtained || '0');
                            const totalObtained = theoryObtained + practicalObtained;
                            const totalMarks = (viewSubjectMarksData?.th_marks || 0) + (viewSubjectMarksData?.pr_in_marks || 0);
                            const percentage = totalMarks > 0 ? ((totalObtained / totalMarks) * 100) : 0;
                            
                            const gradeData = gradesList.find(g => {
                              const minPercent = g.min_percent !== undefined ? g.min_percent : g.minPercent;
                              const maxPercent = g.max_percent !== undefined ? g.max_percent : g.maxPercent;
                              return percentage >= minPercent && percentage <= maxPercent;
                            });
                            const grade = gradeData ? (gradeData.grade_name || gradeData.gradeName) : 'F';
                            const gpa = gradeData ? (gradeData.grade_point !== undefined ? gradeData.grade_point : gradeData.gradePoint) : 0;
                            const remarks = gradeData ? (gradeData.teacher_remarks || gradeData.teacherRemarks || gradeData.description) : '';
                            
                            const result = percentage >= 40 ? 'Pass' : 'Fail';
                            
                            return (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center">{idx + 1}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center">
                                <button className="text-blue-600 hover:underline">Print</button>
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-xs">
                                {student.first_name} {student.last_name}
                                <br/><span className="text-gray-500">({student.roll_no || idx + 1})</span>
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center">{theoryObtained}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center">{practicalObtained}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center font-semibold">{totalObtained}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center font-semibold text-blue-600">{grade}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center font-semibold">{totalObtained}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center">{percentage.toFixed(1)}%</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center font-semibold text-blue-600">{grade}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center font-semibold text-purple-600">{gpa}</td>
                              <td className={`border border-gray-300 px-3 py-2 text-xs text-center font-semibold ${
                                result === 'Pass' ? 'text-green-600' : 'text-red-600'
                              }`}>{result}</td>
                              <td className="border border-gray-300 px-3 py-2 text-xs text-center text-gray-600">{remarks}</td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      // All subjects table
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-blue-600 text-white">
                            <th rowSpan={2} className="border border-gray-300 px-2 py-2 text-xs font-bold">S.No</th>
                            <th rowSpan={2} className="border border-gray-300 px-2 py-2 text-xs font-bold">Student Name</th>
                            {subjectsList.map(subject => (
                              <th key={subject.id} colSpan={8} className="border border-gray-300 px-2 py-2 text-xs font-bold">
                                {subject.subject_name}
                              </th>
                            ))}
                            <th rowSpan={2} className="border border-gray-300 px-2 py-2 text-xs font-bold">Total</th>
                            <th rowSpan={2} className="border border-gray-300 px-2 py-2 text-xs font-bold">%</th>
                            <th rowSpan={2} className="border border-gray-300 px-2 py-2 text-xs font-bold">Grade</th>
                            <th rowSpan={2} className="border border-gray-300 px-2 py-2 text-xs font-bold">Result</th>
                          </tr>
                          <tr className="bg-blue-600 text-white">
                            {subjectsList.map(subject => (
                              <React.Fragment key={subject.id}>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">TH</th>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">PR</th>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">Total</th>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">%</th>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">Grade</th>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">GPA</th>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">Result</th>
                                <th className="border border-gray-300 px-2 py-2 text-xs font-bold">Remarks</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {viewStudentsList.map((student, idx) => {
                            // Calculate total marks for all subjects
                            let totalObtained = 0;
                            let totalFullMarks = 0;
                            
                            subjectsList.forEach(subject => {
                              const markKey = `${student.id}_${subject.id}`;
                              const marks = viewStudentMarks[markKey];
                              if (marks) {
                                const theoryObtained = parseFloat(marks.theoryObtained || '0');
                                const practicalObtained = parseFloat(marks.practicalObtained || '0');
                                totalObtained += theoryObtained + practicalObtained;
                              }
                              // Add full marks (assuming 100 per subject for now)
                              totalFullMarks += 100;
                            });
                            
                            const percentage = totalFullMarks > 0 ? ((totalObtained / totalFullMarks) * 100) : 0;
                            const gradeData = gradesList.find(g => {
                              const minPercent = g.min_percent !== undefined ? g.min_percent : g.minPercent;
                              const maxPercent = g.max_percent !== undefined ? g.max_percent : g.maxPercent;
                              return percentage >= minPercent && percentage <= maxPercent;
                            });
                            const grade = gradeData ? (gradeData.grade_name || gradeData.gradeName) : 'F';
                            const result = percentage >= 40 ? 'Pass' : 'Fail';
                            
                            return (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-2 py-2 text-xs text-center">{idx + 1}</td>
                              <td className="border border-gray-300 px-2 py-2 text-xs">
                                {student.first_name} {student.last_name}
                                <br/><span className="text-gray-500">({student.roll_no || idx + 1})</span>
                              </td>
                              {subjectsList.map(subject => {
                                const markKey = `${student.id}_${subject.id}`;
                                const marks = viewStudentMarks[markKey];
                                const theoryObtained = marks ? parseFloat(marks.theoryObtained || '0') : 0;
                                const practicalObtained = marks ? parseFloat(marks.practicalObtained || '0') : 0;
                                const totalObtained = theoryObtained + practicalObtained;
                                
                                // Get actual full marks for this subject
                                const subjectMarksInfo = viewAllSubjectsMarksData[subject.id];
                                const theoryFullMarks = subjectMarksInfo?.th_marks || 0;
                                const practicalFullMarks = subjectMarksInfo?.pr_in_marks || 0;
                                const totalFullMarks = theoryFullMarks + practicalFullMarks;
                                
                                const percentage = totalFullMarks > 0 ? ((totalObtained / totalFullMarks) * 100) : 0;
                                
                                const gradeData = gradesList.find(g => {
                                  const minPercent = g.min_percent !== undefined ? g.min_percent : g.minPercent;
                                  const maxPercent = g.max_percent !== undefined ? g.max_percent : g.maxPercent;
                                  return percentage >= minPercent && percentage <= maxPercent;
                                });
                                const grade = gradeData ? (gradeData.grade_name || gradeData.gradeName) : 'F';
                                const gpa = gradeData ? (gradeData.grade_point !== undefined ? gradeData.grade_point : gradeData.gradePoint) : 0;
                                const result = percentage >= 40 ? 'Pass' : 'Fail';
                                const remarks = gradeData ? (gradeData.teacher_remarks || gradeData.teacherRemarks || gradeData.description) : '';
                                
                                return (
                                <React.Fragment key={subject.id}>
                                  <td className="border border-gray-300 px-2 py-2 text-xs text-center">{theoryObtained > 0 ? theoryObtained : '-'}</td>
                                  <td className="border border-gray-300 px-2 py-2 text-xs text-center">{practicalObtained > 0 ? practicalObtained : '-'}</td>
                                  <td className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold">{totalObtained > 0 ? totalObtained : '-'}</td>
                                  <td className="border border-gray-300 px-2 py-2 text-xs text-center">{totalObtained > 0 ? percentage.toFixed(1) + '%' : '-'}</td>
                                  <td className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold text-blue-600">{totalObtained > 0 ? grade : '-'}</td>
                                  <td className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold text-purple-600">{totalObtained > 0 ? gpa : '-'}</td>
                                  <td className={`border border-gray-300 px-2 py-2 text-xs text-center font-semibold ${
                                    result === 'Pass' ? 'text-green-600' : 'text-red-600'
                                  }`}>{totalObtained > 0 ? result : '-'}</td>
                                  <td className="border border-gray-300 px-2 py-2 text-xs text-center text-gray-600">{totalObtained > 0 ? remarks : '-'}</td>
                                </React.Fragment>
                                );
                              })}
                              <td className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold">{totalObtained > 0 ? totalObtained : '-'}</td>
                              <td className="border border-gray-300 px-2 py-2 text-xs text-center">{totalObtained > 0 ? percentage.toFixed(1) + '%' : '-'}</td>
                              <td className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold text-blue-600">{totalObtained > 0 ? grade : '-'}</td>
                              <td className={`border border-gray-300 px-2 py-2 text-xs text-center font-semibold ${
                                result === 'Pass' ? 'text-green-600' : 'text-red-600'
                              }`}>{totalObtained > 0 ? result : '-'}</td>
                            </tr>
                          )})}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : activeModule === 'manage_grade' && (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Manage Grade
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="grid grid-cols-1 border-b">
                  <div className="flex flex-col lg:flex-row lg:items-center h-auto lg:h-10 bg-white py-2 lg:py-0">
                    <div className="w-full lg:w-32 bg-gray-50 h-8 lg:h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 lg:border-r mb-1 lg:mb-0">Grade Name:</div>
                    <div className="flex-1 px-0 lg:px-2"><Input value={gradeForm.gradeName} onChange={(e) => setGradeForm(p => ({ ...p, gradeName: e.target.value }))} placeholder="Enter grade name" /></div>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded text-xs font-bold hover:bg-gray-600 transition-all">
                    <Search size={16} /> SEARCH
                  </button>
                  <BlueBtn onClick={() => setGradeForm({ gradeName: '' })} color="bg-gray-400">
                    CANCEL
                  </BlueBtn>
                </div>
              </SectionBox>

              <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-white border-b">
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">S.No.</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Edit</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Delete</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Grade Name</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Min %</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Max %</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Grade Point</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Min G point</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Max G point</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Description</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {gradesList.map((grade, idx) => (
                        <tr key={grade.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-center text-gray-500 font-bold">{idx + 1}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button onClick={() => handleEditGrade(grade)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                              <Edit size={18} />
                            </button>
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button onClick={() => handleDeleteGrade(grade.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{grade.grade_name || grade.gradeName}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.min_percent !== undefined ? grade.min_percent : (grade.minPercent !== undefined ? grade.minPercent : '')}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.max_percent !== undefined ? grade.max_percent : (grade.maxPercent !== undefined ? grade.maxPercent : '')}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.grade_point !== undefined ? grade.grade_point : (grade.gradePoint !== undefined ? grade.gradePoint : '')}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.min_g_point !== undefined ? grade.min_g_point : (grade.minGPoint !== undefined ? grade.minGPoint : '')}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.max_g_point !== undefined ? grade.max_g_point : (grade.maxGPoint !== undefined ? grade.maxGPoint : '')}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.description}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.teacher_remarks || grade.teacherRemarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exams;