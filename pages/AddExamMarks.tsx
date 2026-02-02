import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';

const AddExamMarks: React.FC<{ user: User }> = ({ user }) => {
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
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examNames, setExamNames] = useState([]);
  const [subjectAssignments, setSubjectAssignments] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [marksData, setMarksData] = useState<{[key: string]: {thMarks: string, passMarksTh: string, creditHourTh: string, prMarks: string, passMarksPr: string, creditHourPr: string}}>({});
  const [loading, setLoading] = useState(false);
  const [existingMarks, setExistingMarks] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadSubjects();
    loadExamTypes();
    loadSubjectAssignments();
  }, []);

  useEffect(() => {
    if (form.schoolId && form.batchId && form.classId && form.sectionId && form.examTypeId) {
      loadExamNames();
    } else {
      setExamNames([]);
      setForm(p => ({ ...p, examNameId: '' }));
    }
  }, [form.schoolId, form.batchId, form.classId, form.sectionId, form.examTypeId]);

  useEffect(() => {
    if (form.examNameId && form.schoolId && form.batchId && form.classId && form.sectionId && form.examTypeId) {
      // Don't auto-load marks - only load when search is clicked
    } else {
      setExistingMarks([]);
      setIsUpdate(false);
      setMarksData({});
    }
  }, [form.examNameId]);

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
    const { data, error } = await supabaseService.getBatches(user.school_id);
    if (!error) setBatches(data || []);
  };

  const loadClasses = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.getClasses(user.school_id);
    if (!error) setClasses(data || []);
  };

  const loadSections = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.getSections(user.school_id);
    if (!error) setSections(data || []);
  };

  const loadSubjects = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.getSubjects(user.school_id);
    if (!error) setSubjects(data || []);
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
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId || !form.examTypeId) return;
    const { data, error } = await supabaseService.supabase
      .from('exam_names')
      .select('*')
      .eq('school_id', form.schoolId)
      .eq('batch_id', form.batchId)
      .eq('class_id', form.classId)
      .eq('section_id', form.sectionId)
      .eq('exam_type_id', form.examTypeId);
    if (!error) {
      console.log('Exam Names Data:', data);
      setExamNames(data || []);
    }
  };

  const loadSubjectAssignments = async () => {
    if (!user.school_id) return;
    const { data, error } = await supabaseService.getSubjectAssignments(user.school_id);
    if (!error) setSubjectAssignments(data || []);
  };

  const loadExistingMarks = async () => {
    const { data, error } = await supabaseService.supabase
      .from('exam_marks')
      .select('*')
      .eq('school_id', form.schoolId)
      .eq('batch_id', form.batchId)
      .eq('class_id', form.classId)
      .eq('section_id', form.sectionId)
      .eq('exam_type_id', form.examTypeId)
      .eq('exam_name_id', form.examNameId);
    
    if (!error && data && data.length > 0) {
      setExistingMarks(data);
      setIsUpdate(true);
      
      const newMarksData = {};
      data.forEach(mark => {
        newMarksData[mark.subject_id] = {
          thMarks: mark.th_marks?.toString() || '',
          passMarksTh: mark.pass_marks_th?.toString() || '',
          creditHourTh: mark.credit_hour_th?.toString() || '',
          prMarks: mark.pr_in_marks?.toString() || '',
          passMarksPr: mark.pass_marks_pr_in?.toString() || '',
          creditHourPr: mark.credit_hour_pr_in?.toString() || ''
        };
      });
      setMarksData(newMarksData);
    } else {
      setExistingMarks([]);
      setIsUpdate(false);
      setMarksData({});
    }
  };

  const handleSearch = () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId) {
      alert('Please select School, Batch, Class, and Section');
      return;
    }

    const assignment = subjectAssignments.find(a => 
      String(a.school_id) === String(form.schoolId) &&
      String(a.batch_id) === String(form.batchId) &&
      String(a.class_id) === String(form.classId) &&
      String(a.section_id) === String(form.sectionId)
    );

    if (assignment && assignment.subject_ids) {
      const assignedSubjects = subjects.filter(s => 
        assignment.subject_ids.includes(String(s.id))
      );
      setAvailableSubjects(assignedSubjects);
      // Load existing marks only when search is clicked
      if (form.examTypeId && form.examNameId) {
        loadExistingMarks();
      } else {
        // Clear marks if exam details not selected
        setMarksData({});
        setIsUpdate(false);
        setExistingMarks([]);
      }
    } else {
      setAvailableSubjects([]);
      alert('No subjects assigned for this combination.');
    }
  };

  const handleSubmit = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.sectionId || !form.examTypeId || !form.examNameId) {
      alert('Please fill all required fields');
      return;
    }

    const marksToSave = [];
    for (const subject of availableSubjects) {
      const marks = marksData[subject.id] || {};
      marksToSave.push({
        school_id: form.schoolId,
        batch_id: form.batchId,
        class_id: form.classId,
        section_id: form.sectionId,
        subject_id: subject.id,
        subject_code: subject.subject_code || '',
        subject_name: subject.subject_name || '',
        exam_type_id: form.examTypeId,
        exam_name_id: form.examNameId,
        th_marks: parseFloat(marks.thMarks) || 0,
        pass_marks_th: parseFloat(marks.passMarksTh) || 0,
        credit_hour_th: parseFloat(marks.creditHourTh) || 0,
        pr_in_marks: parseFloat(marks.prMarks) || 0,
        pass_marks_pr_in: parseFloat(marks.passMarksPr) || 0,
        credit_hour_pr_in: parseFloat(marks.creditHourPr) || 0
      });
    }

    setLoading(true);
    try {
      if (isUpdate) {
        await supabaseService.supabase
          .from('exam_marks')
          .delete()
          .eq('school_id', form.schoolId)
          .eq('batch_id', form.batchId)
          .eq('class_id', form.classId)
          .eq('section_id', form.sectionId)
          .eq('exam_type_id', form.examTypeId)
          .eq('exam_name_id', form.examNameId);
      }
      
      const { error } = await supabaseService.supabase
        .from('exam_marks')
        .insert(marksToSave);
      
      if (error) {
        alert('Error saving marks: ' + error.message);
      } else {
        alert(isUpdate ? 'Marks updated successfully!' : 'Exam marks saved successfully!');
        // Reload the marks data after successful save/update
        await loadExistingMarks();
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
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Add Exam Marks</h1>
          <p className="text-sm lg:text-base text-gray-500">Configure exam marks structure</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              EXAM MARKS CONFIGURATION
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
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  SEARCH
                </button>
              </div>
            </div>
          </div>

          {/* Exam Names Table */}
          {examNames.length > 0 && (
            <div className="bg-white border border-gray-300 mt-6">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                <h3 className="text-sm font-bold text-gray-700">Available Exam Names</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl No.</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">School</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Batch</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Section</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Type</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Exam Name</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Current</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examNames.map((exam: any, index: number) => {
                      const school = schools.find((s: any) => String(s.id) === String(exam.school_id));
                      const batch = batches.find((b: any) => String(b.id) === String(exam.batch_id));
                      const cls = classes.find((c: any) => String(c.id) === String(exam.class_id));
                      const section = sections.find((s: any) => String(s.id) === String(exam.section_id));
                      const examType = examTypes.find((et: any) => String(et.id) === String(exam.exam_type_id));
                      return (
                        <tr key={exam.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{index + 1}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs">{school?.school_name || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{batch?.batch_no || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{cls?.class_name || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">{section?.section_name || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs">{examType?.exam_type || '-'}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{exam.exam_name}</td>
                          <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                            {exam.is_current_exam ? '✓' : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subject Configuration Table */}
          {availableSubjects.length > 0 && (
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
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Credit Hour (PR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableSubjects.map((subject: any, index: number) => (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{index + 1}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs text-center">{subject.subject_code}</td>
                        <td className="border border-gray-300 px-2 py-1 text-xs font-semibold">{subject.subject_name}</td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input 
                            type="number" 
                            className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                            placeholder="0" 
                            min="0"
                            value={marksData[subject.id]?.thMarks || ''}
                            onChange={(e) => setMarksData(prev => ({
                              ...prev,
                              [subject.id]: { ...prev[subject.id], thMarks: e.target.value }
                            }))}
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input 
                            type="number" 
                            className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                            placeholder="0" 
                            min="0"
                            value={marksData[subject.id]?.passMarksTh || ''}
                            onChange={(e) => setMarksData(prev => ({
                              ...prev,
                              [subject.id]: { ...prev[subject.id], passMarksTh: e.target.value }
                            }))}
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input 
                            type="number" 
                            className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                            placeholder="0" 
                            min="0"
                            value={marksData[subject.id]?.creditHourTh || ''}
                            onChange={(e) => setMarksData(prev => ({
                              ...prev,
                              [subject.id]: { ...prev[subject.id], creditHourTh: e.target.value }
                            }))}
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input 
                            type="number" 
                            className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                            placeholder="0" 
                            min="0"
                            value={marksData[subject.id]?.prMarks || ''}
                            onChange={(e) => setMarksData(prev => ({
                              ...prev,
                              [subject.id]: { ...prev[subject.id], prMarks: e.target.value }
                            }))}
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input 
                            type="number" 
                            className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                            placeholder="0" 
                            min="0"
                            value={marksData[subject.id]?.passMarksPr || ''}
                            onChange={(e) => setMarksData(prev => ({
                              ...prev,
                              [subject.id]: { ...prev[subject.id], passMarksPr: e.target.value }
                            }))}
                          />
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          <input 
                            type="number" 
                            className="w-full text-xs border-0 outline-0 bg-transparent text-center" 
                            placeholder="0" 
                            min="0"
                            value={marksData[subject.id]?.creditHourPr || ''}
                            onChange={(e) => setMarksData(prev => ({
                              ...prev,
                              [subject.id]: { ...prev[subject.id], creditHourPr: e.target.value }
                            }))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {form.examTypeId && form.examNameId && (
                <div className="p-4 flex justify-center">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-8 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? (isUpdate ? 'UPDATING...' : 'SAVING...') : (isUpdate ? 'UPDATE' : 'SUBMIT')}
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

export default AddExamMarks;