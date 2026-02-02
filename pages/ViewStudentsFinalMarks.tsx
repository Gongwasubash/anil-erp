import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors ${props.className || ''}`}>
    {props.children}
  </select>
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

const ViewStudentsFinalMarks: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    schoolId: '',
    branchName: '',
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

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadSubjects();
    loadExamTypes();
  }, [user.school_id]);

  useEffect(() => {
    if (form.examTypeId) {
      loadExamNames();
    } else {
      setExamNames([]);
      setForm(p => ({ ...p, examNameId: '' }));
    }
  }, [form.examTypeId]);

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
              schoolId: data[0].id,
              branchName: data[0].school_name 
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
      if (user.school_id && form.examTypeId) {
        const { data, error } = await supabaseService.supabase
          .from('exam_names')
          .select('*')
          .eq('school_id', user.school_id)
          .eq('exam_type_id', form.examTypeId);
        if (!error) setExamNames(data || []);
      }
    } catch (e) {
      console.error('Error loading exam names:', e);
    }
  };

  const handleSearch = () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.examTypeId || !form.examNameId) {
      alert('Please fill all required fields');
      return;
    }
    // Add search logic here
    console.log('Searching with form data:', form);
  };

  return (
    <div className="w-full">
      <div className="mb-6 relative pb-4">
        <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
          View Students Final Marks
        </h2>
        <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column */}
          <div className="border-r border-gray-300">
            <div className="flex items-center border-b h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">School*:</div>
              <div className="flex-1 px-2">
                <input 
                  type="text" 
                  value={schools.find(s => s.id === form.schoolId)?.school_name || ''} 
                  className="w-full border-none px-0 py-1 text-xs focus:outline-none bg-transparent"
                  readOnly
                />
              </div>
            </div>
            <div className="flex items-center border-b h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Batch No.*:</div>
              <div className="flex-1 px-2">
                <Select value={form.batchId} onChange={(e) => setForm(p => ({ ...p, batchId: e.target.value }))}>
                  <option value="">--- Select ---</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex items-center border-b h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Section*:</div>
              <div className="flex-1 px-2">
                <Select value={form.sectionId} onChange={(e) => setForm(p => ({ ...p, sectionId: e.target.value }))}>
                  <option value="">--- Select ---</option>
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>{section.section_name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex items-center h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Exam Type:</div>
              <div className="flex-1 px-2">
                <Select value={form.examTypeId} onChange={(e) => setForm(p => ({ ...p, examTypeId: e.target.value }))}>
                  <option value="">--- Select ---</option>
                  {examTypes.map(examType => (
                    <option key={examType.id} value={examType.id}>{examType.exam_type}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="flex items-center border-b h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Branch Name*:</div>
              <div className="flex-1 px-2">
                <input 
                  type="text" 
                  value={form.branchName} 
                  onChange={(e) => setForm(p => ({ ...p, branchName: e.target.value }))}
                  className="w-full border-none px-0 py-1 text-xs focus:outline-none bg-transparent"
                  readOnly
                />
              </div>
            </div>
            <div className="flex items-center border-b h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Class*:</div>
              <div className="flex-1 px-2">
                <Select value={form.classId} onChange={(e) => setForm(p => ({ ...p, classId: e.target.value }))}>
                  <option value="">--- Select ---</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex items-center border-b h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Subject:</div>
              <div className="flex-1 px-2">
                <Select value={form.subjectId} onChange={(e) => setForm(p => ({ ...p, subjectId: e.target.value }))}>
                  <option value="">-----Select-----</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex items-center h-10 bg-white">
              <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Exam Name:</div>
              <div className="flex-1 px-2">
                <Select value={form.examNameId} onChange={(e) => setForm(p => ({ ...p, examNameId: e.target.value }))}>
                  <option value="">--- Select ---</option>
                  {examNames.map(examName => (
                    <option key={examName.id} value={examName.id}>{examName.exam_name}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 p-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-bold text-gray-700">Print Date:</label>
            <input 
              type="date" 
              value={form.printDate}
              onChange={(e) => setForm(p => ({ ...p, printDate: e.target.value }))}
              className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white"
            />
          </div>
          <div className="flex justify-center">
            <BlueBtn onClick={handleSearch}>
              SEARCH
            </BlueBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentsFinalMarks;