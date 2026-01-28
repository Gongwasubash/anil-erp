import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';

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

const ExamsSimple: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState(() => {
    const path = location.pathname;
    if (path.includes('exam_type')) return 'exam_type';
    if (path.includes('exam_name')) return 'exam_name';
    if (path.includes('print_admit_card')) return 'print_admit_card';
    if (path.includes('view_students_marks')) return 'view_students_marks';
    if (path.includes('add_exam_marks')) return 'add_exam_marks';
    if (path.includes('add_students_marks')) return 'add_students_marks';
    if (path.includes('manage_grade')) return 'manage_grade';
    return 'exam_name';
  });

  // Exam Type states
  const [examTypeForm, setExamTypeForm] = useState({ examType: '' });
  const [examTypesList, setExamTypesList] = useState<any[]>([]);
  const [showAddExamTypeForm, setShowAddExamTypeForm] = useState(false);
  const [editingExamType, setEditingExamType] = useState<any>(null);
  
  // Grade states
  const [gradesList, setGradesList] = useState<any[]>([]);
  const [gradeForm, setGradeForm] = useState({
    gradeName: '',
    minPercent: '',
    maxPercent: '',
    gradePoint: '',
    minGPoint: '',
    maxGPoint: '',
    description: '',
    teacherRemarks: ''
  });
  const [showAddGradeForm, setShowAddGradeForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  
  // Add Exam Marks states
  const [addExamMarksForm, setAddExamMarksForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    examTypeId: '',
    examNameId: ''
  });
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [showSubjectsTable, setShowSubjectsTable] = useState(false);
  const [marksData, setMarksData] = useState<{[key: string]: {thMarks: string, prMarks: string}}>({});
  
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
  const [formSchoolsList, setFormSchoolsList] = useState<any[]>([]);
  const [formBatchesList, setFormBatchesList] = useState<any[]>([]);
  const [formClassesList, setFormClassesList] = useState<any[]>([]);
  const [formSectionsList, setFormSectionsList] = useState<any[]>([]);
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
  const [viewStudentMarks, setViewStudentMarks] = useState<any>({});
  const [viewSearchLoading, setViewSearchLoading] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('exam_type')) setActiveModule('exam_type');
    if (path.includes('exam_name')) setActiveModule('exam_name');
    if (path.includes('print_admit_card')) setActiveModule('print_admit_card');
    if (path.includes('view_students_marks')) setActiveModule('view_students_marks');
    if (path.includes('add_exam_marks')) setActiveModule('add_exam_marks');
    if (path.includes('add_students_marks')) setActiveModule('add_students_marks');
    if (path.includes('manage_grade')) setActiveModule('manage_grade');
    fetchExamNames();
    fetchSchools();
    fetchBatches();
    fetchClasses();
    fetchSections();
    fetchExamTypes();
    fetchFormData();
    fetchGrades();
  }, [location.pathname]);

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('schools').select('*');
      if (!error && data) {
        setSchoolsList(data);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('batches').select('*');
      if (!error && data) {
        setBatchesList(data);
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('classes').select('*');
      if (!error && data) {
        setClassesList(data);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchSections = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('sections').select('*');
      if (!error && data) {
        setSectionsList(data);
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
    }
  };

  const fetchExamTypes = async () => {
    try {
      let query = supabaseService.supabase.from('exam_types').select('*');
      if (user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      const { data, error } = await query;
      if (!error && data) {
        setExamTypesList(data);
      }
    } catch (err) {
      console.error('Error fetching exam types:', err);
    }
  };

  const fetchFormData = async () => {
    try {
      let schoolQuery = supabaseService.supabase.from('schools').select('*');
      let batchQuery = supabaseService.supabase.from('batches').select('*');
      let classQuery = supabaseService.supabase.from('classes').select('*');
      let sectionQuery = supabaseService.supabase.from('sections').select('*');
      let examTypeQuery = supabaseService.supabase.from('exam_types').select('*');
      
      if (user.role !== 'Super Admin' && user.school_id) {
        schoolQuery = schoolQuery.eq('id', user.school_id);
        batchQuery = batchQuery.eq('school_id', user.school_id);
        classQuery = classQuery.eq('school_id', user.school_id);
        sectionQuery = sectionQuery.eq('school_id', user.school_id);
        examTypeQuery = examTypeQuery.eq('school_id', user.school_id);
      }
      
      const [schoolsRes, batchesRes, classesRes, sectionsRes, examTypesRes] = await Promise.all([
        schoolQuery,
        batchQuery,
        classQuery,
        sectionQuery,
        examTypeQuery
      ]);
      
      setFormSchoolsList(schoolsRes.data || []);
      setFormBatchesList(batchesRes.data || []);
      setFormClassesList(classesRes.data || []);
      setFormSectionsList(sectionsRes.data || []);
      setFormExamTypesList(examTypesRes.data || []);
    } catch (err) {
      console.error('Error fetching form data:', err);
    }
  };



  const fetchGrades = async () => {
    try {
      let query = supabaseService.supabase.from('grades').select('*').order('grade_point', { ascending: true });
      if (user.role !== 'Super Admin' && user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      const { data, error } = await query;
      if (!error && data) {
        setGradesList(data);
      }
    } catch (err) {
      console.error('Error fetching grades:', err);
    }
  };

  const fetchSubjectsForExamMarks = async () => {
    try {
      const { schoolId, batchId, classId, sectionId } = addExamMarksForm;
      
      if (!schoolId || !batchId || !classId || !sectionId) {
        alert('Please select school, batch, class and section');
        return;
      }
      
      // Fetch subjects based on selected criteria
      let query = supabaseService.supabase
        .from('subjects')
        .select('*')
        .eq('school_id', schoolId)
        .eq('class_id', classId);
        
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching subjects:', error);
        alert('Error fetching subjects: ' + error.message);
      } else {
        setSubjectsList(data || []);
        setShowSubjectsTable(true);
        setMarksData({});
      }
    } catch (err) {
      console.error('Database error:', err);
      alert('Database connection error');
    }
  };

  const saveExamMarks = async () => {
    try {
      const { schoolId, batchId, classId, sectionId, examTypeId, examNameId } = addExamMarksForm;
      
      if (!examTypeId || !examNameId) {
        alert('Please select exam type and exam name');
        return;
      }
      
      const marksToSave = [];
      
      for (const [subjectId, marks] of Object.entries(marksData)) {
        if (marks.thMarks || marks.prMarks) {
          marksToSave.push({
            school_id: schoolId,
            batch_id: batchId,
            class_id: classId,
            section_id: sectionId,
            exam_type_id: examTypeId,
            exam_name_id: examNameId,
            subject_id: subjectId,
            th_marks: parseFloat(marks.thMarks) || 0,
            pr_marks: parseFloat(marks.prMarks) || 0
          });
        }
      }
      
      if (marksToSave.length === 0) {
        alert('Please enter at least one mark');
        return;
      }
      
      const { error } = await supabaseService.supabase
        .from('exam_marks')
        .insert(marksToSave);
        
      if (error) {
        console.error('Error saving marks:', error);
        alert('Error saving marks: ' + error.message);
      } else {
        alert('Marks saved successfully!');
        setMarksData({});
      }
    } catch (err) {
      console.error('Database error:', err);
      alert('Database connection error');
    }
  };

  const fetchExamNames = async () => {
    try {
      let query = supabaseService.supabase.from('exam_names').select('*');
      if (user.role !== 'Super Admin' && user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      const { data, error } = await query;
      if (!error && data) {
        console.log('Exam names data:', data);
        setExamNamesList(data);
      }
    } catch (err) {
      console.error('Error fetching exam names:', err);
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

  const handleEditGrade = (grade: any) => {
    setGradeForm({
      gradeName: grade.grade_name || '',
      minPercent: grade.min_percent?.toString() || '',
      maxPercent: grade.max_percent?.toString() || '',
      gradePoint: grade.grade_point?.toString() || '',
      minGPoint: grade.min_g_point?.toString() || '',
      maxGPoint: grade.max_g_point?.toString() || '',
      description: grade.description || '',
      teacherRemarks: grade.teacher_remarks || ''
    });
    setEditingGrade(grade);
    setShowAddGradeForm(true);
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

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Exam Name Management</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage exam names and configurations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {activeModule === 'exam_type' ? (
            <button 
              onClick={() => setShowAddExamTypeForm(true)}
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Add Exam Type
            </button>
          ) : activeModule === 'manage_grade' ? (
            <button 
              onClick={() => setShowAddGradeForm(true)}
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Add Grade
            </button>
          ) : (
            <button 
              onClick={() => setShowAddExamNameForm(true)}
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Add Exam Name
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              {activeModule === 'exam_type' ? 'Exam Type' : 
               activeModule === 'print_admit_card' ? 'Print Admit Card' : 
               activeModule === 'view_students_marks' ? 'View Students Marks' :
               activeModule === 'add_exam_marks' ? 'Add Exam Marks' :
               activeModule === 'add_students_marks' ? 'Add Students Marks' :
               activeModule === 'manage_grade' ? 'Manage Grade' : 'Exam Name'}
            </h2>
            <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
          </div>

          {activeModule === 'exam_type' ? (
            <div>
              {showAddExamTypeForm && (
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
                            .insert([{ exam_type: examTypeForm.examType, school_id: user.school_id }]);
                            
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
              )}

              <div className="bg-white border border-gray-300 mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Delete</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examTypesList.map((examType, idx) => (
                        <tr key={examType.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                            <button onClick={() => handleEditExamType(examType)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all">
                              <Edit size={18} />
                            </button>
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                            <button onClick={() => handleDeleteExamType(examType.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{examType.exam_type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeModule === 'print_admit_card' ? (
            <div>
              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formSchoolsList.map(school => (
                          <option key={school.id} value={school.id}>{school.school_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formBatchesList.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formClassesList.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formSectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formExamTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {examNamesList.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Symbol No.</label>
                      <Input placeholder="Enter symbol number" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Start Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam End Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn>SEARCH</BlueBtn>
                  <BlueBtn color="bg-gray-400">RESET</BlueBtn>
                </div>
              </SectionBox>
            </div>
          ) : activeModule === 'view_students_marks' ? (
            <div>
              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formSchoolsList.map(school => (
                          <option key={school.id} value={school.id}>{school.school_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formBatchesList.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formClassesList.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formSectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formExamTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {examNamesList.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Print Date</label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn>SEARCH</BlueBtn>
                </div>
              </SectionBox>
            </div>
          ) : activeModule === 'add_exam_marks' ? (
            <div>
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
                        {formSchoolsList.map(school => (
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
                        {formBatchesList.map(batch => (
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
                        {formClassesList.map(cls => (
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
                        <option value="">--- Select ---</option>
                        {formSectionsList.map(section => (
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
                        {formExamTypesList.map(type => (
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
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn onClick={fetchSubjectsForExamMarks}>SEARCH</BlueBtn>
                  <BlueBtn 
                    onClick={() => {
                      setAddExamMarksForm({
                        schoolId: '',
                        batchId: '',
                        classId: '',
                        sectionId: '',
                        examTypeId: '',
                        examNameId: ''
                      });
                      setShowSubjectsTable(false);
                      setSubjectsList([]);
                      setMarksData({});
                    }} 
                    color="bg-gray-400"
                  >
                    RESET
                  </BlueBtn>
                </div>
              </SectionBox>
              
              {showSubjectsTable && (
                <div className="bg-white border border-gray-300 mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Subject Code</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Subject Name</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">TH Marks</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Pass Marks TH</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Credit Hour (TH)</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">PR/IN Marks</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Pass Marks PR/IN</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Credit Hour (PR/IN)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectsList.map((subject, idx) => (
                          <tr key={subject.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subject.subject_code}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{subject.subject_name}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                              <Input 
                                type="number" 
                                placeholder="TH" 
                                className="w-16 text-center"
                                value={marksData[subject.id]?.thMarks || ''}
                                onChange={(e) => setMarksData(prev => ({
                                  ...prev,
                                  [subject.id]: {
                                    ...prev[subject.id],
                                    thMarks: e.target.value
                                  }
                                }))}
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subject.pass_marks_th || 'N/A'}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subject.credit_hour_th || 'N/A'}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                              <Input 
                                type="number" 
                                placeholder="PR" 
                                className="w-16 text-center"
                                value={marksData[subject.id]?.prMarks || ''}
                                onChange={(e) => setMarksData(prev => ({
                                  ...prev,
                                  [subject.id]: {
                                    ...prev[subject.id],
                                    prMarks: e.target.value
                                  }
                                }))}
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subject.pass_marks_pr || 'N/A'}</td>
                            <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subject.credit_hour_pr || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {subjectsList.length > 0 && (
                    <div className="p-3.5 flex justify-center bg-white border-t">
                      <BlueBtn onClick={saveExamMarks}>SAVE MARKS</BlueBtn>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeModule === 'add_students_marks' ? (
            <div>
              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formSchoolsList.map(school => (
                          <option key={school.id} value={school.id}>{school.school_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formBatchesList.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formClassesList.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formSectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {formExamTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                        {examNamesList.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject*</label>
                      <select className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400">
                        <option value="">--- Select ---</option>
                      </select>
                    </div>
                  </div>
                </div>
              </SectionBox>
            </div>
          ) : activeModule === 'manage_grade' ? (
            <div>
              {showAddGradeForm && (
                <SectionBox>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Grade Name</label>
                        <Input 
                          value={gradeForm.gradeName}
                          onChange={(e) => setGradeForm(p => ({ ...p, gradeName: e.target.value }))}
                          placeholder="Enter grade name" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Percentage</label>
                        <Input 
                          type="number"
                          value={gradeForm.minPercent}
                          onChange={(e) => setGradeForm(p => ({ ...p, minPercent: e.target.value }))}
                          placeholder="Enter minimum percentage" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Maximum Percentage</label>
                        <Input 
                          type="number"
                          value={gradeForm.maxPercent}
                          onChange={(e) => setGradeForm(p => ({ ...p, maxPercent: e.target.value }))}
                          placeholder="Enter maximum percentage" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Grade Point</label>
                        <Input 
                          type="number" 
                          step="0.1"
                          value={gradeForm.gradePoint}
                          onChange={(e) => setGradeForm(p => ({ ...p, gradePoint: e.target.value }))}
                          placeholder="Enter grade point" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Grade Point</label>
                        <Input 
                          type="number" 
                          step="0.1"
                          value={gradeForm.minGPoint}
                          onChange={(e) => setGradeForm(p => ({ ...p, minGPoint: e.target.value }))}
                          placeholder="Enter minimum grade point" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Maximum Grade Point</label>
                        <Input 
                          type="number" 
                          step="0.1"
                          value={gradeForm.maxGPoint}
                          onChange={(e) => setGradeForm(p => ({ ...p, maxGPoint: e.target.value }))}
                          placeholder="Enter maximum grade point" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Grade Description</label>
                      <Input 
                        value={gradeForm.description}
                        onChange={(e) => setGradeForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Enter grade description" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Teacher Remarks</label>
                      <Input 
                        value={gradeForm.teacherRemarks}
                        onChange={(e) => setGradeForm(p => ({ ...p, teacherRemarks: e.target.value }))}
                        placeholder="Enter teacher remarks" 
                      />
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                    <BlueBtn onClick={async () => {
                      try {
                        const gradeData = {
                          grade_name: gradeForm.gradeName,
                          min_percent: parseFloat(gradeForm.minPercent) || 0,
                          max_percent: parseFloat(gradeForm.maxPercent) || 0,
                          grade_point: parseFloat(gradeForm.gradePoint) || 0,
                          min_g_point: parseFloat(gradeForm.minGPoint) || 0,
                          max_g_point: parseFloat(gradeForm.maxGPoint) || 0,
                          description: gradeForm.description,
                          teacher_remarks: gradeForm.teacherRemarks,
                          school_id: user.school_id
                        };
                        
                        if (editingGrade) {
                          const { error } = await supabaseService.supabase
                            .from('grades')
                            .update(gradeData)
                            .eq('id', editingGrade.id);
                            
                          if (error) {
                            alert('Error updating grade: ' + error.message);
                          } else {
                            alert('Grade updated successfully!');
                            setShowAddGradeForm(false);
                            setEditingGrade(null);
                            setGradeForm({
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
                          const { error } = await supabaseService.supabase
                            .from('grades')
                            .insert([gradeData]);
                            
                          if (error) {
                            alert('Error saving grade: ' + error.message);
                          } else {
                            alert('Grade saved successfully!');
                            setShowAddGradeForm(false);
                            setGradeForm({
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
                        alert('Database connection error');
                      }
                    }}>
                      {editingGrade ? 'UPDATE' : 'SUBMIT'}
                    </BlueBtn>
                    <BlueBtn onClick={() => {
                      setShowAddGradeForm(false);
                      setEditingGrade(null);
                      setGradeForm({
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
              )}
              
              <div className="bg-white border border-gray-300 mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Grade Name</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Min %</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Max %</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Grade Point</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Description</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradesList.map((grade, idx) => (
                        <tr key={grade.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{grade.grade_name}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{grade.min_percent}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{grade.max_percent}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{grade.grade_point}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs">{grade.description}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                            <button onClick={() => handleEditGrade(grade)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all">
                              <Edit size={18} />
                            </button>
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                            <button onClick={() => handleDeleteGrade(grade.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
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
          ) : (
            <div>

          {showAddExamNameForm && (
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
                      {formSchoolsList.map(school => (
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
                      {formBatchesList.map(batch => (
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
                      {formClassesList.map(cls => (
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
                      {formSectionsList.map(section => (
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
                      {formExamTypesList.map(type => (
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
          )}

          <div className="bg-white border border-gray-300 mt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">School</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Batch No.</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Section</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Type</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {examNamesList.map((examName, idx) => {
                    // Use the same method as form dropdowns to get display values
                    const schoolName = formSchoolsList.find(s => s.id === examName.school_id)?.school_name || 
                                     schoolsList.find(s => s.id === examName.school_id)?.school_name || 'JHOR HIGH SCHOOL';
                    const batchNo = formBatchesList.find(b => b.id === examName.batch_id)?.batch_no || 
                                  batchesList.find(b => b.id === examName.batch_id)?.batch_no || '2080';
                    const className = formClassesList.find(c => c.id === examName.class_id)?.class_name || 
                                    classesList.find(c => c.id === examName.class_id)?.class_name || '1';
                    const sectionName = formSectionsList.find(s => s.id === examName.section_id)?.section_name || 
                                      sectionsList.find(s => s.id === examName.section_id)?.section_name || 'A';
                    const examTypeName = formExamTypesList.find(t => t.id === examName.exam_type_id)?.exam_type || 
                                       examTypesList.find(t => t.id === examName.exam_type_id)?.exam_type || 'Annual';
                    
                    return (
                    <tr key={examName.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{schoolName}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{batchNo}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{className}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{sectionName}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{examTypeName}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{examName.exam_name}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                        <button onClick={() => handleEditExamName(examName)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all">
                          <Edit size={18} />
                        </button>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                        <button onClick={() => handleDeleteExamName(examName.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
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

export default ExamsSimple;