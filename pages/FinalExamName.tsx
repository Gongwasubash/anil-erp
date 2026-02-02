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

const FinalExamName: React.FC<{ user: User }> = ({ user }) => {
  const [examNameForm, setExamNameForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionIds: [] as string[],
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
  const [examTypesList, setExamTypesList] = useState<any[]>([]);
  const [showManagePercentages, setShowManagePercentages] = useState(false);
  const [selectedExamForPercentages, setSelectedExamForPercentages] = useState<any>(null);
  const [percentageForm, setPercentageForm] = useState({
    examTypeId: '',
    examNameId: '',
    examPercentage: '',
    order: ''
  });
  const [percentagesList, setPercentagesList] = useState<any[]>([]);

  useEffect(() => {
    fetchExamNames();
    fetchFormData();
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

  const fetchExamNames = async () => {
    try {
      let query = supabaseService.supabase.from('final_exam_names').select('*');
      if (user.role !== 'Super Admin' && user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      const { data, error } = await query;
      if (!error && data) {
        setExamNamesList(data);
      }
    } catch (err) {
      console.error('Error fetching exam names:', err);
    }
  };

  const fetchPercentages = async (examNameId: string) => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('exam_percentages')
        .select('*')
        .eq('final_exam_name_id', examNameId)
        .order('order');
      if (!error && data) {
        setPercentagesList(data);
      }
    } catch (err) {
      console.error('Error fetching percentages:', err);
    }
  };

  const handleManagePercentages = (examName: any) => {
    setSelectedExamForPercentages(examName);
    setShowManagePercentages(true);
    fetchPercentages(examName.id);
  };

  const handleSavePercentage = async () => {
    try {
      if (!percentageForm.examTypeId || !percentageForm.examNameId || !percentageForm.examPercentage || !percentageForm.order) {
        alert('Please fill all fields');
        return;
      }

      const { error } = await supabaseService.supabase
        .from('exam_percentages')
        .insert([{
          final_exam_name_id: selectedExamForPercentages.id,
          exam_type_id: percentageForm.examTypeId,
          exam_name_id: percentageForm.examNameId,
          exam_percentage: parseFloat(percentageForm.examPercentage),
          order: parseInt(percentageForm.order)
        }]);

      if (error) {
        alert('Error saving percentage: ' + error.message);
      } else {
        alert('Percentage saved successfully!');
        setPercentageForm({ examTypeId: '', examNameId: '', examPercentage: '', order: '' });
        fetchPercentages(selectedExamForPercentages.id);
      }
    } catch (err) {
      alert('Database connection error');
    }
  };

  const handleDeletePercentage = async (percentageId: string) => {
    if (!window.confirm('Are you sure you want to delete this percentage?')) return;
    
    try {
      const { error } = await supabaseService.supabase
        .from('exam_percentages')
        .delete()
        .eq('id', percentageId);
        
      if (error) {
        alert('Error deleting percentage: ' + error.message);
      } else {
        alert('Percentage deleted successfully!');
        fetchPercentages(selectedExamForPercentages.id);
      }
    } catch (err) {
      alert('Database connection error');
    }
  };

  const handleEditExamName = (examName: any) => {
    setExamNameForm({
      schoolId: examName.school_id || '',
      batchId: examName.batch_id || '',
      classId: examName.class_id || '',
      sectionIds: examName.section_id ? [examName.section_id] : [],
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
        .from('final_exam_names')
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
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Final Exam Name Management</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage final exam names and configurations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setShowAddExamNameForm(true)}
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
                    <div className="border border-gray-300 px-3 py-2 bg-white flex flex-wrap gap-3">
                      {sectionsList.map(section => (
                        <label key={section.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={examNameForm.sectionIds.includes(section.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExamNameForm(p => ({ ...p, sectionIds: [...p.sectionIds, section.id] }));
                              } else {
                                setExamNameForm(p => ({ ...p, sectionIds: p.sectionIds.filter(id => id !== section.id) }));
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Term Exam Name*</label>
                    <Input 
                      value={examNameForm.examName} 
                      onChange={(e) => setExamNameForm(p => ({ ...p, examName: e.target.value }))}
                      placeholder="Enter term exam name" 
                    />
                  </div>
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
                      section_id: examNameForm.sectionIds[0] || null,
                      exam_type_id: examNameForm.examTypeId,
                      exam_name: examNameForm.examName,
                      is_current_exam: examNameForm.isCurrentExam
                    };
                    
                    if (editingExamName) {
                      const { error } = await supabaseService.supabase
                        .from('final_exam_names')
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
                          sectionIds: [],
                          examTypeId: '',
                          examName: '',
                          isCurrentExam: false
                        });
                        fetchExamNames();
                      }
                    } else {
                      const examRecords = examNameForm.sectionIds.map(sectionId => ({
                        school_id: examNameForm.schoolId,
                        batch_id: examNameForm.batchId,
                        class_id: examNameForm.classId,
                        section_id: sectionId,
                        exam_type_id: examNameForm.examTypeId,
                        exam_name: examNameForm.examName,
                        is_current_exam: examNameForm.isCurrentExam
                      }));
                      
                      const { data, error } = await supabaseService.supabase
                        .from('final_exam_names')
                        .insert(examRecords)
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
                          sectionIds: [],
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
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Branch Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Batch No.</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Section</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Type</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Term Exam Name</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Manage Exam Percentages</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {examNamesList.map((examName, idx) => {
                    const schoolName = schoolsList.find(s => s.id === examName.school_id)?.school_name || 'N/A';
                    const batchNo = batchesList.find(b => b.id === examName.batch_id)?.batch_no || 'N/A';
                    const className = classesList.find(c => c.id === examName.class_id)?.class_name || 'N/A';
                    const sectionName = sectionsList.find(s => s.id === examName.section_id)?.section_name || 'N/A';
                    const examTypeName = examTypesList.find(t => t.id === examName.exam_type_id)?.exam_type || 'N/A';
                    
                    return (
                    <tr key={examName.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{schoolName}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{schoolName}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{batchNo}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{className}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">{sectionName}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{examTypeName}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{examName.exam_name}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                        <button onClick={() => handleManagePercentages(examName)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold">Manage Exam Percentages</button>
                      </td>
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

          {showManagePercentages && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Manage Exam Percentages</h3>
                
                <SectionBox>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                        <select 
                          value={percentageForm.examTypeId}
                          onChange={(e) => setPercentageForm(p => ({ ...p, examTypeId: e.target.value }))}
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
                          value={percentageForm.examNameId}
                          onChange={(e) => setPercentageForm(p => ({ ...p, examNameId: e.target.value }))}
                          className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                        >
                          <option value="">--Select--</option>
                          {examNamesList.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Exam Percentages*</label>
                        <Input 
                          type="number"
                          value={percentageForm.examPercentage}
                          onChange={(e) => setPercentageForm(p => ({ ...p, examPercentage: e.target.value }))}
                          placeholder="Enter percentage"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Order*</label>
                        <Input 
                          type="number"
                          value={percentageForm.order}
                          onChange={(e) => setPercentageForm(p => ({ ...p, order: e.target.value }))}
                          placeholder="Enter order"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 flex justify-center gap-4 bg-white border-t">
                    <BlueBtn onClick={handleSavePercentage}>ADD</BlueBtn>
                  </div>
                </SectionBox>

                <div className="bg-white border border-gray-300 mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Type</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Name</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Percentages</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Order</th>
                          <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {percentagesList.map((percentage, idx) => {
                          const examTypeName = examTypesList.find(t => t.id === percentage.exam_type_id)?.exam_type || 'N/A';
                          const examName = examNamesList.find(e => e.id === percentage.exam_name_id)?.exam_name || 'N/A';
                          
                          return (
                            <tr key={percentage.id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-2 py-1 text-xs text-center">{idx + 1}</td>
                              <td className="border border-gray-300 px-2 py-1 text-xs">{examTypeName}</td>
                              <td className="border border-gray-300 px-2 py-1 text-xs">{examName}</td>
                              <td className="border border-gray-300 px-2 py-1 text-xs text-center">{percentage.exam_percentage}%</td>
                              <td className="border border-gray-300 px-2 py-1 text-xs text-center">{percentage.order}</td>
                              <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                                <button onClick={() => handleDeletePercentage(percentage.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all">
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

                <div className="mt-4 flex justify-end">
                  <BlueBtn onClick={() => {
                    setShowManagePercentages(false);
                    setSelectedExamForPercentages(null);
                    setPercentageForm({ examTypeId: '', examNameId: '', examPercentage: '', order: '' });
                    setPercentagesList([]);
                  }} color="bg-gray-400">
                    CLOSE
                  </BlueBtn>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalExamName;
