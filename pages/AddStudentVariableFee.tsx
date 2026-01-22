import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';
import { Phone, Eye, Edit2, Trash2 } from 'lucide-react';

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors ${props.className || ''}`} />
);

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

const AddStudentVariableFee: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    school: 'JHOR HIGH SCHOOL',
    batch: '2080',
    class: '1',
    section: 'A',
    feeMonth: ''
  });

  const [feeHeads, setFeeHeads] = useState<any[]>([]);
  const [selectedFeeHeads, setSelectedFeeHeads] = useState<{[key: string]: string}>({});
  const [feeMonths, setFeeMonths] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [studentFees, setStudentFees] = useState<{[studentId: string]: {[feeHeadId: string]: string}}>({});
  const [selectedMonths, setSelectedMonths] = useState<{[monthId: string]: boolean}>({});

  const saveStudentVariableFee = async () => {
    try {
      const selectedMonthIds = Object.keys(selectedMonths).filter(monthId => selectedMonths[monthId]);
      
      if (selectedMonthIds.length === 0) {
        alert('Please select at least one month');
        return;
      }

      const feeRecords = [];
      
      for (const studentId of Object.keys(studentFees)) {
        for (const feeHeadId of Object.keys(studentFees[studentId])) {
          const amount = studentFees[studentId][feeHeadId];
          if (amount !== '' && amount !== null && amount !== undefined) {
            for (const monthId of selectedMonthIds) {
              if (parseFloat(amount) === 0) {
                // Delete record if amount is 0
                await supabaseService.supabase
                  .from('student_variable_fees')
                  .delete()
                  .eq('student_id', studentId)
                  .eq('fee_head_id', feeHeadId)
                  .eq('month_id', monthId);
              } else {
                feeRecords.push({
                  student_id: studentId,
                  fee_head_id: feeHeadId,
                  month_id: monthId,
                  amount: parseFloat(amount),
                  school: form.school,
                  batch: form.batch,
                  class: form.class,
                  section: form.section
                });
              }
            }
          }
        }
      }

      if (feeRecords.length > 0) {
        const { error } = await supabaseService.supabase
          .from('student_variable_fees')
          .upsert(feeRecords, { onConflict: 'student_id,fee_head_id,month_id' });

        if (error) throw error;
      }
      
      alert('Student variable fees saved successfully!');
      
    } catch (error) {
      console.error('Error saving fees:', error);
      alert(`Error saving fees: ${error.message}`);
    }
  };

  const fillGridData = () => {
    const newStudentFees = { ...studentFees };
    students.forEach(student => {
      if (!newStudentFees[student.id]) newStudentFees[student.id] = {};
      Object.keys(selectedFeeHeads).forEach(feeHeadId => {
        if (selectedFeeHeads[feeHeadId]) {
          newStudentFees[student.id][feeHeadId] = selectedFeeHeads[feeHeadId];
        }
      });
    });
    setStudentFees(newStudentFees);
  };

  useEffect(() => {
    fetchFeeHeads();
    fetchFeeMonths();
    fetchSchools();
    fetchBatches();
    fetchClasses();
    fetchSections();
  }, []);

  useEffect(() => {
    if (form.school && form.batch && form.class && form.section) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [form.school, form.batch, form.class, form.section]);

  useEffect(() => {
    if (students.length > 0) {
      loadExistingFees();
      loadFeeHeadValues();
    }
  }, [students, form.feeMonth]);

  const loadFeeHeadValues = async () => {
    try {
      if (!form.feeMonth || students.length === 0) {
        setSelectedFeeHeads({});
        return;
      }
      
      const selectedMonth = feeMonths.find(m => m.month_name === form.feeMonth);
      if (!selectedMonth) {
        setSelectedFeeHeads({});
        return;
      }
      
      const studentIds = students.map(s => s.id);
      const { data, error } = await supabaseService.supabase
        .from('student_variable_fees')
        .select('*')
        .in('student_id', studentIds)
        .eq('month_id', selectedMonth.id);
      
      if (error) throw error;
      
      const feeHeadTotals = {};
      data?.forEach(fee => {
        if (!feeHeadTotals[fee.fee_head_id]) {
          feeHeadTotals[fee.fee_head_id] = 0;
        }
        feeHeadTotals[fee.fee_head_id] += parseFloat(fee.amount);
      });
      
      const feeHeadValues = {};
      Object.keys(feeHeadTotals).forEach(feeHeadId => {
        feeHeadValues[feeHeadId] = (feeHeadTotals[feeHeadId] / students.length).toString();
      });
      
      setSelectedFeeHeads(feeHeadValues);
    } catch (e) {
      console.error('Error loading fee head values:', e);
    }
  };

  const loadExistingFees = async () => {
    try {
      const studentIds = students.map(s => s.id);
      
      if (!form.feeMonth) {
        setStudentFees({});
        return;
      }
      
      const selectedMonth = feeMonths.find(m => m.month_name === form.feeMonth);
      if (!selectedMonth) {
        setStudentFees({});
        return;
      }
      
      const { data, error } = await supabaseService.supabase
        .from('student_variable_fees')
        .select('*')
        .in('student_id', studentIds)
        .eq('month_id', selectedMonth.id);
      
      if (error) throw error;
      
      console.log('Loaded existing fees:', data);
      
      const existingFees = {};
      
      data?.forEach(fee => {
        if (!existingFees[fee.student_id]) existingFees[fee.student_id] = {};
        existingFees[fee.student_id][fee.fee_head_id] = fee.amount.toString();
      });
      
      console.log('Setting student fees:', existingFees);
      
      setStudentFees(existingFees);
    } catch (e) {
      console.error('Error loading existing fees:', e);
    }
  };

  const fetchFeeHeads = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('fee_heads').select('*');
      if (error) throw error;
      setFeeHeads(data || []);
    } catch (e) {
      console.error('Error fetching fee heads:', e);
    }
  };

  const fetchFeeMonths = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('fee_months').select('*');
      if (error) throw error;
      setFeeMonths(data || []);
    } catch (e) {
      console.error('Error fetching fee months:', e);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('schools').select('*');
      if (error) throw error;
      setSchools(data || []);
    } catch (e) {
      console.error('Error fetching schools:', e);
    }
  };

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('batches').select('*');
      if (error) throw error;
      setBatches(data || []);
    } catch (e) {
      console.error('Error fetching batches:', e);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('classes').select('*');
      if (error) throw error;
      setClasses(data || []);
    } catch (e) {
      console.error('Error fetching classes:', e);
    }
  };

  const fetchSections = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('sections').select('*');
      if (error) throw error;
      setSections(data || []);
    } catch (e) {
      console.error('Error fetching sections:', e);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('students')
        .select('*')
        .eq('school', form.school)
        .eq('batch_no', form.batch)
        .eq('class', form.class)
        .eq('section', form.section)
        .order('roll_no');
      
      if (error) throw error;
      console.log('Students fetched:', data);
      setStudents(data || []);
    } catch (e) {
      console.error('Error fetching students:', e);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 relative pb-4">
        <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
          Add Student Variable Fee
        </h2>
        <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 border-b">
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">School*:</div>
            <div className="flex-1 px-2">
              <Select value={form.school} onChange={(e) => setForm(p => ({ ...p, school: e.target.value }))}>
                <option value="">--- Select ---</option>
                {schools.map(school => (
                  <option key={school.id} value={school.school_name}>{school.school_name}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Batch*:</div>
            <div className="flex-1 px-2">
              <Select value={form.batch} onChange={(e) => setForm(p => ({ ...p, batch: e.target.value }))}>
                <option value="">--- Select ---</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.batch_no}>{batch.batch_no}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Class*:</div>
            <div className="flex-1 px-2">
              <Select value={form.class} onChange={(e) => setForm(p => ({ ...p, class: e.target.value }))}>
                <option value="">--- Select ---</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.class_name}>{cls.class_name}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Section*:</div>
            <div className="flex-1 px-2">
              <Select value={form.section} onChange={(e) => setForm(p => ({ ...p, section: e.target.value }))}>
                <option value="">--- Select ---</option>
                {sections.map(section => (
                  <option key={section.id} value={section.section_name}>{section.section_name}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center h-10 bg-white">
            <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Fee Month*:</div>
            <div className="flex-1 px-2">
              <Select value={form.feeMonth} onChange={(e) => setForm(p => ({ ...p, feeMonth: e.target.value }))}>
                <option value="">--select--</option>
                {feeMonths.sort((a, b) => (a.month_order || 0) - (b.month_order || 0)).map(month => (
                  <option key={month.id} value={month.month_name}>{month.month_name}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
          <BlueBtn onClick={fetchStudents}>
            SEARCH
          </BlueBtn>
        </div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Select Fee Heads</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {feeHeads.map(feeHead => (
              <div key={feeHead.id} className="flex flex-col">
                <label className="text-xs text-gray-700 mb-1">
                  {feeHead.fee_head}
                </label>
                <input 
                  type="number" 
                  placeholder="Amount"
                  min="0"
                  value={selectedFeeHeads[feeHead.id] || ''}
                  onChange={(e) => setSelectedFeeHeads(prev => ({ ...prev, [feeHead.id]: e.target.value }))}
                  className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <BlueBtn onClick={fillGridData}>
              FILL DATA IN GRID
            </BlueBtn>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white border border-gray-300 mb-6">
          <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Student Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Roll</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Name</th>
                  {feeHeads.map(feeHead => (
                    <th key={feeHead.id} className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">{feeHead.fee_head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{student.roll_no}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{`${student.first_name || ''} ${student.last_name || ''}`.trim()}</td>
                    {feeHeads.map(feeHead => (
                      <td key={feeHead.id} className="border border-gray-300 px-1 py-1 text-xs text-center">
                        <input 
                          type="number" 
                          min="0"
                          value={studentFees[student.id]?.[feeHead.id] || ''}
                          onChange={(e) => {
                            const newFees = { ...studentFees };
                            if (!newFees[student.id]) newFees[student.id] = {};
                            newFees[student.id][feeHead.id] = e.target.value;
                            setStudentFees(newFees);
                          }}
                          className="w-full border border-gray-200 text-xs text-center focus:outline-none focus:border-blue-400 bg-white px-1 py-1"
                          placeholder="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-300 mb-6">
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Select Months</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {feeMonths.sort((a, b) => (a.month_order || 0) - (b.month_order || 0)).map(month => (
              <div key={month.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`month-${month.id}`}
                  checked={selectedMonths[month.id] || false}
                  onChange={(e) => setSelectedMonths(prev => ({ ...prev, [month.id]: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor={`month-${month.id}`} className="text-xs text-gray-700 cursor-pointer">
                  {month.month_name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <BlueBtn onClick={saveStudentVariableFee}>
          SAVE
        </BlueBtn>
        <BlueBtn onClick={() => {
          setForm({ school: 'JHOR HIGH SCHOOL', batch: '2080', class: '1', section: 'A', feeMonth: '' });
          setSelectedFeeHeads({});
          setStudentFees({});
          setSelectedMonths({});
        }} color="bg-gray-400">
          RESET
        </BlueBtn>
      </div>
    </div>
  );
};

export default AddStudentVariableFee;