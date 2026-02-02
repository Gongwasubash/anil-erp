import React, { useState, useEffect } from 'react';
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

const TermExamName: React.FC<{ user: User }> = ({ user }) => {
  const [termExamNameForm, setTermExamNameForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionIds: [] as string[],
    examTypeId: '',
    examName: '',
    isCurrentExam: false
  });
  const [termExamNamesList, setTermExamNamesList] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [showManagePercentages, setShowManagePercentages] = useState(false);
  const [currentFinalExamId, setCurrentFinalExamId] = useState<number | null>(null);
  const [editingPercentage, setEditingPercentage] = useState<any>(null);
  const [percentageForm, setPercentageForm] = useState({
    examTypeId: '',
    examNameId: '',
    examPercentage: '',
    order: ''
  });
  const [percentagesList, setPercentagesList] = useState<any[]>([]);
  const [examNamesFromBackend, setExamNamesFromBackend] = useState<any[]>([]);
  const [schoolsList, setSchoolsList] = useState<any[]>([]);
  const [batchesList, setBatchesList] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [sectionsList, setSectionsList] = useState<any[]>([]);
  const [examTypesList, setExamTypesList] = useState<any[]>([]);
  const [allPercentages, setAllPercentages] = useState<{[key: number]: any[]}>({});

  useEffect(() => {
    fetchTermExamNames();
    fetchFormData();
    fetchExamNamesFromBackend();
    fetchAllPercentages();
  }, []);

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
      
      setSchoolsList(schoolsRes.data || []);
      setBatchesList(batchesRes.data || []);
      setClassesList(classesRes.data || []);
      setSectionsList(sectionsRes.data || []);
      setExamTypesList(examTypesRes.data || []);
    } catch (err) {
      console.error('Error fetching form data:', err);
    }
  };

  const fetchTermExamNames = async () => {
    try {
      let query = supabaseService.supabase.from('final_exam_names').select('*');
      if (user.role !== 'Super Admin' && user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      const { data, error } = await query;
      console.log('Final exam names data:', data);
      console.log('Final exam names error:', error);
      if (!error && data) {
        setTermExamNamesList(data);
      }
    } catch (err) {
      console.error('Error fetching term exam names:', err);
    }
  };

  const handleEdit = (exam: any) => {
    setTermExamNameForm({
      schoolId: exam.school_id || '',
      batchId: String(exam.batch_id || ''),
      classId: String(exam.class_id || ''),
      sectionIds: exam.section_ids ? exam.section_ids.map((id: any) => String(id)) : [],
      examTypeId: String(exam.exam_type_id || ''),
      examName: exam.exam_name || '',
      isCurrentExam: exam.is_current_exam || false
    });
    setEditingExam(exam);
    setShowAddForm(true);
  };

  const handleDelete = async (examId: string) => {
    if (!window.confirm('Are you sure you want to delete this final exam name?')) return;
    
    try {
      await supabaseService.supabase
        .from('exam_percentages')
        .delete()
        .eq('final_exam_name_id', examId);
      
      const { error } = await supabaseService.supabase
        .from('final_exam_names')
        .delete()
        .eq('id', examId);
        
      if (error) {
        alert('Error deleting final exam name: ' + error.message);
      } else {
        alert('Final exam name deleted successfully!');
        fetchTermExamNames();
      }
    } catch (err) {
      alert('Database connection error');
    }
  };

  const handleManagePercentages = (finalExamId: number) => {
    const finalExam = termExamNamesList.find(e => e.id === finalExamId);
    setCurrentFinalExamId(finalExamId);
    setShowManagePercentages(true);
    setEditingPercentage(null);
    setPercentageForm({ examTypeId: '', examNameId: '', examPercentage: '', order: '' });
    fetchPercentages(finalExamId);
    // Load exam names filtered by the final exam's context
    if (finalExam) {
      fetchFilteredExamNames(finalExam.school_id, finalExam.batch_id, finalExam.class_id, finalExam.section_id, finalExam.exam_type_id);
    }
  };

  const handleEditPercentage = (percentage: any) => {
    setEditingPercentage(percentage);
    setPercentageForm({
      examTypeId: String(percentage.exam_type_id),
      examNameId: percentage.exam_name_id,
      examPercentage: String(percentage.exam_percentage),
      order: String(percentage.order)
    });
  };

  const handleSavePercentage = async () => {
    try {
      const finalExam = termExamNamesList.find(e => e.id === currentFinalExamId);
      
      if (editingPercentage) {
        const { error } = await supabaseService.supabase
          .from('exam_percentages')
          .update({
            school_id: finalExam?.school_id,
            exam_type_id: parseInt(percentageForm.examTypeId),
            exam_name_id: percentageForm.examNameId,
            exam_percentage: parseFloat(percentageForm.examPercentage),
            order: parseInt(percentageForm.order)
          })
          .eq('id', editingPercentage.id);
        
        if (error) {
          alert('Error updating percentage: ' + error.message);
        } else {
          alert('Percentage updated successfully!');
          setEditingPercentage(null);
          setPercentageForm({ examTypeId: '', examNameId: '', examPercentage: '', order: '' });
          fetchPercentages(currentFinalExamId!);
        }
      } else {
        const exists = percentagesList.some(p => p.exam_name_id === percentageForm.examNameId);
        if (exists) {
          alert('This exam name already exists in the table. Each exam name must be unique.');
          return;
        }
        
        const { error } = await supabaseService.supabase
          .from('exam_percentages')
          .insert([{
            school_id: finalExam?.school_id,
            final_exam_name_id: currentFinalExamId,
            exam_type_id: parseInt(percentageForm.examTypeId),
            exam_name_id: percentageForm.examNameId,
            exam_percentage: parseFloat(percentageForm.examPercentage),
            order: parseInt(percentageForm.order)
          }]);
        
        if (error) {
          alert('Error saving percentage: ' + error.message);
        } else {
          alert('Percentage saved successfully!');
          setPercentageForm({ examTypeId: '', examNameId: '', examPercentage: '', order: '' });
          fetchPercentages(currentFinalExamId!);
          fetchAllPercentages();
        }
      }
    } catch (err) {
      alert('Database connection error');
    }
  };

  const fetchPercentages = async (finalExamId?: number | null) => {
    try {
      if (!finalExamId) return;
      const { data, error } = await supabaseService.supabase
        .from('exam_percentages')
        .select('*')
        .eq('final_exam_name_id', finalExamId);
      if (!error && data) {
        setPercentagesList(data);
      }
    } catch (err) {
      console.error('Error fetching percentages:', err);
    }
  };

  const fetchExamNamesFromBackend = async () => {
    try {
      let query = supabaseService.supabase.from('exam_names').select('*');
      if (user.role !== 'Super Admin' && user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      const { data, error } = await query;
      if (!error && data) {
        setExamNamesFromBackend(data);
      }
    } catch (err) {
      console.error('Error fetching exam names from backend:', err);
    }
  };

  const fetchFilteredExamNames = async (schoolId: string, batchId: number, classId: number, sectionId: number, examTypeId: number) => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('exam_names')
        .select('*')
        .eq('school_id', schoolId)
        .eq('batch_id', batchId)
        .eq('class_id', classId)
        .eq('section_id', sectionId)
        .eq('exam_type_id', examTypeId);
      if (!error && data) {
        setExamNamesFromBackend(data);
      }
    } catch (err) {
      console.error('Error fetching filtered exam names:', err);
    }
  };

  const fetchAllPercentages = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('exam_percentages')
        .select('*')
        .order('order');
      if (!error && data) {
        const grouped = data.reduce((acc: any, perc: any) => {
          if (!acc[perc.final_exam_name_id]) acc[perc.final_exam_name_id] = [];
          acc[perc.final_exam_name_id].push(perc);
          return acc;
        }, {});
        setAllPercentages(grouped);
      }
    } catch (err) {
      console.error('Error fetching all percentages:', err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Final Exam Management</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage final exam names and configurations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Add Final Exam Name
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              FINAL EXAM NAME
            </h2>
            <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
          </div>

          {showAddForm && (
            <SectionBox>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                    <select 
                      value={termExamNameForm.schoolId} 
                      onChange={(e) => setTermExamNameForm(p => ({ ...p, schoolId: e.target.value }))}
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
                      value={termExamNameForm.batchId} 
                      onChange={(e) => setTermExamNameForm(p => ({ ...p, batchId: e.target.value }))}
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
                      value={termExamNameForm.classId} 
                      onChange={(e) => setTermExamNameForm(p => ({ ...p, classId: e.target.value }))}
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
                    <div className="border border-gray-300 px-3 py-2 bg-white">
                      <label className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-200">
                        <input 
                          type="checkbox" 
                          checked={termExamNameForm.sectionIds.length === sectionsList.length && sectionsList.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTermExamNameForm(p => ({ ...p, sectionIds: sectionsList.map(s => String(s.id)) }));
                            } else {
                              setTermExamNameForm(p => ({ ...p, sectionIds: [] }));
                            }
                          }}
                          className="rounded" 
                        />
                        <span className="text-xs font-bold">Select All</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {sectionsList.map(section => (
                          <label key={section.id} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={termExamNameForm.sectionIds.includes(String(section.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTermExamNameForm(p => ({ ...p, sectionIds: [...p.sectionIds, String(section.id)] }));
                                } else {
                                  setTermExamNameForm(p => ({ ...p, sectionIds: p.sectionIds.filter(id => id !== String(section.id)) }));
                                }
                              }}
                              className="rounded" 
                            />
                            <span className="text-xs">{section.section_name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                    <select 
                      value={termExamNameForm.examTypeId} 
                      onChange={(e) => setTermExamNameForm(p => ({ ...p, examTypeId: e.target.value }))}
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Final Exam Name*</label>
                  <Input 
                    value={termExamNameForm.examName} 
                    onChange={(e) => setTermExamNameForm(p => ({ ...p, examName: e.target.value }))}
                    placeholder="Enter final exam name" 
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={termExamNameForm.isCurrentExam}
                      onChange={(e) => setTermExamNameForm(p => ({ ...p, isCurrentExam: e.target.checked }))}
                      className="rounded" 
                    />
                    <span className="text-sm font-medium">Is Current Exam</span>
                  </label>
                </div>
              </div>
              <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                <BlueBtn onClick={async () => {
                  try {
                    if (editingExam) {
                      await supabaseService.supabase
                        .from('final_exam_names')
                        .delete()
                        .in('id', editingExam.ids || [editingExam.id]);
                      
                      const examRecords = termExamNameForm.sectionIds.map(sectionId => ({
                        school_id: termExamNameForm.schoolId,
                        batch_id: parseInt(termExamNameForm.batchId),
                        class_id: parseInt(termExamNameForm.classId),
                        section_id: parseInt(sectionId),
                        exam_type_id: parseInt(termExamNameForm.examTypeId),
                        exam_name: termExamNameForm.examName,
                        is_current_exam: termExamNameForm.isCurrentExam
                      }));
                      
                      const { error } = await supabaseService.supabase
                        .from('final_exam_names')
                        .insert(examRecords);
                        
                      if (error) {
                        alert('Error updating final exam name: ' + error.message);
                      } else {
                        alert('Final exam name updated successfully!');
                        setShowAddForm(false);
                        setEditingExam(null);
                        setTermExamNameForm({
                          schoolId: '',
                          batchId: '',
                          classId: '',
                          sectionIds: [],
                          examTypeId: '',
                          examName: '',
                          isCurrentExam: false
                        });
                        fetchTermExamNames();
                      }
                    } else {
                      const examRecords = termExamNameForm.sectionIds.map(sectionId => ({
                        school_id: termExamNameForm.schoolId,
                        batch_id: parseInt(termExamNameForm.batchId),
                        class_id: parseInt(termExamNameForm.classId),
                        section_id: parseInt(sectionId),
                        exam_type_id: parseInt(termExamNameForm.examTypeId),
                        exam_name: termExamNameForm.examName,
                        is_current_exam: termExamNameForm.isCurrentExam
                      }));
                      
                      const { error } = await supabaseService.supabase
                        .from('final_exam_names')
                        .insert(examRecords);
                        
                      if (error) {
                        alert('Error saving final exam name: ' + error.message);
                      } else {
                        alert('Final exam name saved successfully!');
                        setShowAddForm(false);
                        setTermExamNameForm({
                          schoolId: '',
                          batchId: '',
                          classId: '',
                          sectionIds: [],
                          examTypeId: '',
                          examName: '',
                          isCurrentExam: false
                        });
                        fetchTermExamNames();
                      }
                    }
                  } catch (err) {
                    alert('Database connection error');
                  }
                }}>
                  {editingExam ? 'UPDATE' : 'SUBMIT'}
                </BlueBtn>
                <BlueBtn onClick={() => {
                  setShowAddForm(false);
                  setEditingExam(null);
                  setTermExamNameForm({
                    schoolId: '',
                    batchId: '',
                    classId: '',
                    sectionIds: [],
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
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Final Exam Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Percentages</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Manage Exam Percentages</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const groupedExams = termExamNamesList.reduce((acc: any, exam) => {
                      const key = `${exam.school_id}-${exam.batch_id}-${exam.class_id}-${exam.exam_type_id}-${exam.exam_name}`;
                      if (!acc[key]) {
                        acc[key] = {
                          ...exam,
                          section_ids: [exam.section_id],
                          ids: [exam.id]
                        };
                      } else {
                        acc[key].section_ids.push(exam.section_id);
                        acc[key].ids.push(exam.id);
                      }
                      return acc;
                    }, {});

                    return Object.values(groupedExams).map((exam: any, idx) => {
                      const schoolName = schoolsList.find(s => s.id === exam.school_id)?.school_name || 'N/A';
                      const batchNo = batchesList.find(b => b.id == exam.batch_id)?.batch_no || 'N/A';
                      const className = classesList.find(c => c.id == exam.class_id)?.class_name || 'N/A';
                      const sectionNames = exam.section_ids.map((sId: any) => 
                        sectionsList.find(s => s.id == sId)?.section_name || 'N/A'
                      ).sort().join(', ');
                      const examTypeName = examTypesList.find(t => t.id == exam.exam_type_id)?.exam_type || 'N/A';
                      
                      return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">{schoolName}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{batchNo}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{className}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{sectionNames}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">{examTypeName}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{exam.exam_name}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs">
                          {allPercentages[exam.id]?.length > 0 ? (
                            <div className="space-y-1">
                              {allPercentages[exam.id].map((perc: any, i: number) => (
                                <div key={i} className="text-xs">
                                  {perc.exam_name_id}: {perc.exam_percentage}%
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">Not configured</span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                          <button onClick={() => handleManagePercentages(exam.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                            Manage
                          </button>
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                          <button onClick={() => handleEdit(exam)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all">
                            <Edit size={18} />
                          </button>
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                          <button onClick={() => {
                            if (window.confirm('Are you sure you want to delete this final exam name for all sections?')) {
                              exam.ids.forEach((id: string) => handleDelete(id));
                            }
                          }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {showManagePercentages && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setShowManagePercentages(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Manage Exam Percentages</h3>
                  <button onClick={() => setShowManagePercentages(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="p-6 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type</label>
                          <select 
                            value={percentageForm.examTypeId}
                            onChange={(e) => setPercentageForm(p => ({ ...p, examTypeId: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            value={percentageForm.examNameId}
                            onChange={(e) => setPercentageForm(p => ({ ...p, examNameId: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">--- Select ---</option>
                            {(() => {
                              const uniqueNames = new Map();
                              examNamesFromBackend.forEach((exam: any) => {
                                if (!uniqueNames.has(exam.exam_name)) {
                                  uniqueNames.set(exam.exam_name, exam);
                                }
                              });
                              return Array.from(uniqueNames.values()).map((exam: any) => (
                                <option key={exam.id} value={exam.exam_name}>{exam.exam_name}</option>
                              ));
                            })()}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Order</label>
                          <input 
                            type="number"
                            value={percentageForm.order}
                            onChange={(e) => setPercentageForm(p => ({ ...p, order: e.target.value }))}
                            placeholder="Enter order"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Exam Percentages</label>
                          <input 
                            type="number"
                            value={percentageForm.examPercentage}
                            onChange={(e) => setPercentageForm(p => ({ ...p, examPercentage: e.target.value }))}
                            placeholder="Enter percentage"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center gap-4 mt-6">
                        <BlueBtn onClick={handleSavePercentage}>{editingPercentage ? 'UPDATE' : 'SUBMIT'}</BlueBtn>
                        <BlueBtn onClick={() => {
                          setShowManagePercentages(false);
                          setEditingPercentage(null);
                          setPercentageForm({ examTypeId: '', examNameId: '', examPercentage: '', order: '' });
                        }} color="bg-gray-500">CANCEL</BlueBtn>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                              <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                              <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 text-center">Exam Type</th>
                              <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 text-center">Exam Name</th>
                              <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 text-center">Exam Percentages</th>
                              <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 text-center">Order</th>
                              <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 text-center">Edit</th>
                              <th className="border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 text-center">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {percentagesList.map((percentage, idx) => {
                              const examType = examTypesList.find(t => t.id == percentage.exam_type_id)?.exam_type || 'N/A';
                              const examName = percentage.exam_name_id || 'N/A';
                              return (
                                <tr key={percentage.id} className="hover:bg-blue-50 transition-colors">
                                  <td className="border border-gray-300 px-4 py-2 text-xs text-center">{idx + 1}</td>
                                  <td className="border border-gray-300 px-4 py-2 text-xs">{examType}</td>
                                  <td className="border border-gray-300 px-4 py-2 text-xs">{examName}</td>
                                  <td className="border border-gray-300 px-4 py-2 text-xs text-center font-semibold text-blue-600">{percentage.exam_percentage}%</td>
                                  <td className="border border-gray-300 px-4 py-2 text-xs text-center">{percentage.order}</td>
                                  <td className="border border-gray-300 px-4 py-2 text-xs text-center">
                                    <button onClick={() => handleEditPercentage(percentage)} className="px-3 py-1 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all shadow-sm">
                                      Edit
                                    </button>
                                  </td>
                                  <td className="border border-gray-300 px-4 py-2 text-xs text-center">
                                    <button className="px-3 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all shadow-sm">
                                      Delete
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermExamName;
