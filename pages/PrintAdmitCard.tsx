import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import { User } from '../types';

const PrintAdmitCard: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    examTypeId: '',
    examNameId: '',
    symbolNo: '',
    examStartDate: '',
    examEndDate: ''
  });

  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examNames, setExamNames] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [symbolNumbers, setSymbolNumbers] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadExamTypes();
  }, [user.school_id]);

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

  const handleSearch = async () => {
    if (!form.schoolId || !form.batchId || !form.classId || !form.examTypeId || !form.examNameId) {
      alert('Please fill School, Batch, Class, Exam Type and Exam Name');
      return;
    }

    setLoading(true);
    setStudents([]);
    setSelectedStudents(new Set());
    setSelectAll(false);
    
    try {
      const batchData = batches.find((b: any) => b.id == form.batchId);
      const classData = classes.find((c: any) => c.id == form.classId);
      const sectionData = sections.find((s: any) => s.id == form.sectionId);

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
        console.error('Error:', error);
        alert('Error fetching students: ' + error.message);
      } else if (data && data.length > 0) {
        const enrichedData = data.map(student => ({
          ...student,
          batches: { batch_no: student.batch_no },
          classes: { class_name: student.class },
          sections: { section_name: student.section }
        }));
        
        setStudents(enrichedData);
      } else {
        alert('No students found for the selected criteria');
      }
    } catch (err) {
      console.error('Database error:', err);
      alert('Database connection error');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setForm({
      schoolId: user.school_id,
      batchId: '',
      classId: '',
      sectionId: '',
      examTypeId: '',
      examNameId: '',
      symbolNo: '',
      examStartDate: '',
      examEndDate: ''
    });
    setStudents([]);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents(new Set());
    } else {
      const allStudentIds = new Set(students.map((student: any) => student.id));
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
    setSelectAll(newSelected.size === students.length);
  };

  const handlePrintAdmitCards = () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student');
      return;
    }
    
    const selectedStudentsData = Array.from(selectedStudents).map(studentId => {
      const student = students.find((s: any) => s.id === studentId);
      return {
        ...student,
        symbolNumber: symbolNumbers[studentId] || 'Not Set'
      };
    }).filter(Boolean);
    
    const printData = {
      students: selectedStudentsData,
      form: form,
      examTypes: examTypes,
      examNames: examNames
    };
    
    sessionStorage.setItem('printAdmitCardData', JSON.stringify(printData));
    window.open(`${window.location.origin}/#/admit-card-print`, '_blank');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Print Admit Card</h1>
          <p className="text-sm lg:text-base text-gray-500">Generate and print student admit cards</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              PRINT ADMIT CARD
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
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
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Symbol No. Label</label>
                  <input 
                    type="text"
                    value={form.symbolNo}
                    onChange={(e) => setForm(p => ({ ...p, symbolNo: e.target.value }))}
                    placeholder="e.g., 2080-001, ABC-001"
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exam Start Date</label>
                  <input 
                    type="date"
                    value={form.examStartDate}
                    onChange={(e) => setForm(p => ({ ...p, examStartDate: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exam End Date</label>
                  <input 
                    type="date"
                    value={form.examEndDate}
                    onChange={(e) => setForm(p => ({ ...p, examEndDate: e.target.value }))}
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
                <button 
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>

          {students.length > 0 && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <button 
                  onClick={handlePrintAdmitCards}
                  disabled={selectedStudents.size === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Print Admit Cards ({selectedStudents.size})
                </button>
              </div>
              <div className="bg-white border border-gray-300 mt-6 overflow-x-auto shadow-lg rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">
                      <input 
                        type="checkbox" 
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Sl No.</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Symbol No.</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Roll Number</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Firstname</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Lastname</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Batch</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Class</th>
                    <th className="border border-white px-3 py-3 text-sm font-semibold text-center">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any, index: number) => (
                    <tr key={student.id} className={`${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedStudents.has(student.id)}
                          onChange={() => handleStudentSelect(student.id)}
                          className="w-4 h-4" 
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center font-medium">{index + 1}</td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">
                        <input 
                          type="text" 
                          placeholder="Enter symbol no" 
                          value={symbolNumbers[student.id] || ''}
                          onChange={(e) => setSymbolNumbers(prev => ({...prev, [student.id]: e.target.value}))}
                          className="w-full text-center text-xs border-0 bg-transparent focus:outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">{student.roll_no}</td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">{student.first_name}</td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">{student.last_name}</td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">{student.batches?.batch_no || 'N/A'}</td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">{student.classes?.class_name}</td>
                      <td className="border border-gray-300 px-3 py-3 text-sm text-center">{student.sections?.section_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}

          {students.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>No students found. Please search with different criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintAdmitCard;