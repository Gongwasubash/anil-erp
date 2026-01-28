import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';

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

const PrintPreBill: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    school: 'JHOR HIGH SCHOOL',
    batch: '2080',
    class: '1',
    section: 'A'
  });

  const [feeHeads, setFeeHeads] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [studentFees, setStudentFees] = useState<any>({});
  const [feeMonths, setFeeMonths] = useState<any[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<{[monthId: string]: boolean}>({});
  const [previousDues, setPreviousDues] = useState<{[studentId: string]: number}>({});
  const [schoolDetails, setSchoolDetails] = useState<any>({});
  const [selectedStudents, setSelectedStudents] = useState<{[studentId: string]: boolean}>({});
  const [selectAll, setSelectAll] = useState(false);
  const [payTill, setPayTill] = useState('');

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const convertHundreds = (n: number): string => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        n = 0;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };
    
    const crores = Math.floor(num / 10000000);
    const lakhs = Math.floor((num % 10000000) / 100000);
    const thousands = Math.floor((num % 100000) / 1000);
    const hundreds = num % 1000;
    
    let result = '';
    if (crores > 0) result += convertHundreds(crores) + 'Crore ';
    if (lakhs > 0) result += convertHundreds(lakhs) + 'Lakh ';
    if (thousands > 0) result += convertHundreds(thousands) + 'Thousand ';
    if (hundreds > 0) result += convertHundreds(hundreds);
    
    return result.trim();
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
    if (form.school) {
      fetchSchoolDetails();
    }
  }, [form.school]);

  useEffect(() => {
    if (students.length > 0) {
      loadExistingFees();
      loadPreviousDues();
    }
  }, [students, selectedMonths, feeHeads]);

  const loadPreviousDues = async () => {
    try {
      if (students.length === 0) {
        setPreviousDues({});
        return;
      }
      
      const studentIds = students.map(s => s.id);
      const { data, error } = await supabaseService.supabase
        .from('fee_payments')
        .select('student_id, remaining_amount')
        .in('student_id', studentIds)
        .gt('remaining_amount', 0);
      
      if (error) throw error;
      
      const dues = {};
      data?.forEach(payment => {
        if (!dues[payment.student_id]) dues[payment.student_id] = 0;
        dues[payment.student_id] += parseFloat(payment.remaining_amount || 0);
      });
      
      setPreviousDues(dues);
    } catch (e) {
      console.error('Error loading previous dues:', e);
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
      let query = supabaseService.supabase.from('fee_months').select('*');
      
      // Only filter by school_id if user has one
      if (user.school_id) {
        query = query.eq('school_id', user.school_id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setFeeMonths(data || []);
    } catch (e) {
      console.error('Error fetching fee months:', e);
    }
  };

  const fetchSchools = async () => {
    try {
      if (user.role === 'Super Admin') {
        setSchools([]);
        return;
      }
      const { data, error } = await supabaseService.supabase.from('schools').select('*');
      if (error) throw error;
      const userSchools = user.school_id ? data?.filter(s => s.id === user.school_id) || [] : [];
      setSchools(userSchools);
    } catch (e) {
      console.error('Error fetching schools:', e);
    }
  };

  const fetchSchoolDetails = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('schools')
        .select('*')
        .eq('school_name', form.school)
        .single();
      
      if (error) throw error;
      setSchoolDetails(data || {});
    } catch (e) {
      console.error('Error fetching school details:', e);
      setSchoolDetails({});
    }
  };

  const fetchBatches = async () => {
    try {
      if (user.role === 'Super Admin') {
        setBatches([]);
        return;
      }
      const { data, error } = await supabaseService.supabase.from('batches').select('*');
      if (error) throw error;
      setBatches(data || []);
    } catch (e) {
      console.error('Error fetching batches:', e);
    }
  };

  const fetchClasses = async () => {
    try {
      if (user.role === 'Super Admin') {
        setClasses([]);
        return;
      }
      const { data, error } = await supabaseService.supabase.from('classes').select('*');
      if (error) throw error;
      setClasses(data || []);
    } catch (e) {
      console.error('Error fetching classes:', e);
    }
  };

  const fetchSections = async () => {
    try {
      if (user.role === 'Super Admin') {
        setSections([]);
        return;
      }
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
      setStudents(data || []);
    } catch (e) {
      console.error('Error fetching students:', e);
    }
  };

  const loadExistingFees = async () => {
    try {
      const studentIds = students.map(s => s.id);
      const selectedMonthIds = Object.keys(selectedMonths).filter(monthId => selectedMonths[monthId]);
      
      if (selectedMonthIds.length === 0) {
        setStudentFees({});
        return;
      }
      
      // Get student variable fees
      const { data, error } = await supabaseService.supabase
        .from('student_variable_fees')
        .select('*')
        .in('student_id', studentIds)
        .in('month_id', selectedMonthIds);
      
      if (error) throw error;
      
      // Get paid fees from fee_payments table
      const selectedMonthNames = feeMonths.filter(m => selectedMonthIds.includes(m.id.toString())).map(m => m.month_name);
      const { data: paidFees } = await supabaseService.supabase
        .from('fee_payments')
        .select('student_id, month_name, fee_head')
        .in('student_id', studentIds)
        .in('month_name', selectedMonthNames);
      
      // Create set of paid month-fee combinations
      const paidCombinations = new Set();
      paidFees?.forEach(payment => {
        const key = `${payment.student_id}_${payment.month_name}_${payment.fee_head}`;
        paidCombinations.add(key);
      });
      
      const existingFees = {};
      data?.forEach(fee => {
        const feeHeadObj = feeHeads.find(fh => fh.id == fee.fee_head_id);
        const monthObj = feeMonths.find(m => m.id == fee.month_id);
        
        if (feeHeadObj && monthObj) {
          // Check if this month-fee combination is paid
          const combinationKey = `${fee.student_id}_${monthObj.month_name}_${feeHeadObj.fee_head}`;
          
          // Only include if NOT paid
          if (!paidCombinations.has(combinationKey)) {
            if (!existingFees[fee.student_id]) existingFees[fee.student_id] = {};
            if (!existingFees[fee.student_id][fee.fee_head_id]) {
              existingFees[fee.student_id][fee.fee_head_id] = 0;
            }
            existingFees[fee.student_id][fee.fee_head_id] += parseFloat(fee.amount);
          }
        }
      });
      
      // Convert totals back to strings
      Object.keys(existingFees).forEach(studentId => {
        Object.keys(existingFees[studentId]).forEach(feeHeadId => {
          existingFees[studentId][feeHeadId] = existingFees[studentId][feeHeadId].toString();
        });
      });
      
      setStudentFees(existingFees);
    } catch (e) {
      console.error('Error loading existing fees:', e);
    }
  };

  const printPreBill = async () => {
    const selectedStudentsList = students.filter(student => selectedStudents[student.id]);
    
    if (selectedStudentsList.length === 0) {
      alert('Please select at least one student');
      return;
    }
    
    // Ensure school details are loaded
    let currentSchoolDetails = schoolDetails;
    if (!currentSchoolDetails.school_name) {
      try {
        const { data, error } = await supabaseService.supabase
          .from('schools')
          .select('*')
          .eq('school_name', form.school)
          .single();
        
        if (!error && data) {
          currentSchoolDetails = data;
        }
      } catch (e) {
        console.error('Error fetching school details:', e);
        currentSchoolDetails = {};
      }
    }
    
    // Get paid fees for all selected students
    const selectedMonthNames = feeMonths.filter(m => selectedMonths[m.id]).map(m => m.month_name);
    const studentIds = selectedStudentsList.map(s => s.id);
    
    const { data: allPaidFees } = await supabaseService.supabase
      .from('fee_payments')
      .select('student_id, month_name, fee_head')
      .in('student_id', studentIds)
      .in('month_name', selectedMonthNames);
    
    const billsHtml = selectedStudentsList.map(student => {
      // Get paid combinations for this student
      const studentPaidFees = allPaidFees?.filter(p => p.student_id === student.id) || [];
      const paidCombinations = new Set();
      studentPaidFees.forEach(payment => {
        const key = `${payment.student_id}_${payment.month_name}_${payment.fee_head}`;
        paidCombinations.add(key);
      });
      
      // Calculate unpaid months for each fee head
      const feeRows = [];
      let rowIndex = 0;
      let calculatedTotal = 0;
      
      Object.keys(studentFees[student.id] || {}).forEach((feeHeadId) => {
        const feeHead = feeHeads.find(fh => fh.id == feeHeadId);
        
        // Get unpaid months for this specific fee head
        const unpaidMonths = feeMonths.filter(month => {
          if (!selectedMonths[month.id]) return false;
          const combinationKey = `${student.id}_${month.month_name}_${feeHead?.fee_head}`;
          return !paidCombinations.has(combinationKey);
        });
        
        if (unpaidMonths.length > 0) {
          const monthNames = unpaidMonths.map(m => m.month_name).join(', ');
          const totalAmount = parseFloat(studentFees[student.id][feeHeadId]);
          
          calculatedTotal += totalAmount;
          
          rowIndex++;
          feeRows.push(`
            <tr>
              <td class='text-center'>${rowIndex}.</td>
              <td>${monthNames}</td>
              <td>${feeHead?.fee_head || 'Fee'}</td>
              <td class='text-right'>Rs. ${totalAmount.toFixed(0)}</td>
            </tr>
          `);
        }
      });
      
      const previousFee = previousDues[student.id] || 0;
      const currentFee = calculatedTotal;
      const totalAmount = previousFee + calculatedTotal;
      
      const selectedMonthNames = feeMonths.filter(m => selectedMonths[m.id]).map(m => m.month_name).join(', ');
      
      return `
        <div class='bill'>
          <div class='header'>
            <div class='school-info'>
              <img src='${currentSchoolDetails.logo_url || '/logo.png'}' class='school-logo'>
              <div class='school-name'>${currentSchoolDetails.school_name || form.school}</div>
              <div class='school-details'>${currentSchoolDetails.address || 'School Address'}</div>
              <div class='school-details'>Phone: ${currentSchoolDetails.phone || 'N/A'} | Email: ${currentSchoolDetails.email || 'N/A'}</div>
              <div class='pan-number'>PAN: ${currentSchoolDetails.pan_no || 'N/A'}</div>
              <div class='divider'></div>
            </div>
            <div class='student-info'>
              <table class='info-table'>
                <tr>
                  <td><strong>Name:</strong> ${student.first_name} ${student.last_name}</td>
                  <td><strong>Bill No:</strong> ${Math.floor(Math.random() * 100000)}</td>
                  <td><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</td>
                </tr>
                <tr>
                  <td><strong>Class:</strong> ${form.class}/${form.section}</td>
                  <td><strong>Roll No:</strong> ${student.roll_no}</td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>
          <div class='content'>
            <table class='fee-table'>
              <thead>
                <tr>
                  <th>S/No</th>
                  <th>MONTH</th>
                  <th>PARTICULARS</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                ${feeRows.join('')}
                <tr>
                  <td colspan='3' class='text-right'><strong>This Month's Total:</strong></td>
                  <td class='text-right'><strong>Rs. ${currentFee.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td colspan='3' class='text-right'><strong>Previous Dues:</strong></td>
                  <td class='text-right'><strong>Rs. ${previousFee.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td colspan='3' class='text-right'><strong>Total Amount:</strong></td>
                  <td class='text-right'><strong>Rs. ${totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
            <div style='font-size: 10px; margin: 5px 0;'>
              <strong>Amount In Words:</strong> ${numberToWords(Math.floor(totalAmount))} Rupees ${totalAmount % 1 !== 0 ? 'and ' + Math.round((totalAmount % 1) * 100) + ' Paisa' : ''} Only
              ${payTill ? `<br><strong>Pay Till:</strong> ${new Date(payTill).toLocaleDateString('en-GB')}` : ''}
            </div>
          </div>
          <div class='footer'>
            <div class='signature-section'>
              <span>Cash/Cheque/DD Collected by admin</span>
              <span>Authorized Signatory</span>
            </div>
            <div class='note'>Note: Please pay fees on time</div>
          </div>
        </div>
      `;
    }).join('');
    
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Bills - ${selectedStudentsList.length} Students</title>
        <style>
          @page { size: A4; margin: 5mm; }
          body { font-family: arial, helvetica, serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; }
          .bill { width: 105mm; height: 148mm; border: 1px solid #000; padding: 5mm; box-sizing: border-box; background: white; page-break-inside: avoid; position: relative; }
          .header { margin-bottom: 4px; }
          .school-info { text-align: center; margin-bottom: 4px; position: relative; }
          .pan-number { position: absolute; top: 0; right: 0; font-size: 8px; font-weight: bold; color: #000; }
          .school-logo { width: 35px; height: 35px; margin-bottom: 3px; }
          .school-name { font-size: 14px; font-weight: bold; color: #2c3e50; margin-bottom: 3px; }
          .school-details { font-size: 10px; color: #7f8c8d; margin-bottom: 2px; }
          .divider { border-bottom: 1px solid #3498db; width: 100%; margin: 3px 0; }
          .student-info { margin-bottom: 5px; }
          .info-table { width: 100%; border: none; font-size: 10px; color: #000; }
          .info-table td { border: none; padding: 2px 3px; color: #000; }
          .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          .fee-table th, .fee-table td { border: 1px solid #000; padding: 3px 5px; font-size: 10px; }
          .fee-table th { background-color: #f0f0f0; font-weight: bold; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .footer { position: absolute; bottom: 5mm; left: 5mm; right: 5mm; font-size: 9px; }
          .signature-section { display: flex; justify-content: space-between; margin-top: 5px; }
          .note { background-color: #f0f0f0; padding: 2px; text-align: center; font-weight: bold; }
          .print-button { position: fixed; top: 20px; right: 20px; background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
          .print-button:hover { background: #2980b9; }
          @media print { .print-button { display: none; } body { background: white; padding: 0; } }
        </style>
      </head>
      <body>
        <button class='print-button' onclick='window.print()'>🖨️ PRINT ALL BILLS</button>
        <div class='container'>
          ${billsHtml}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="w-full">
      <div className="mb-6 relative pb-4">
        <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
          Print Pre-Bill
        </h2>
        <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
      </div>

      <div className="bg-white border border-gray-300 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 border-b">
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
          <div className="flex items-center h-10 bg-white">
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
        </div>
        <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
          <BlueBtn onClick={fetchStudents}>
            SEARCH
          </BlueBtn>
        </div>
      </div>

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
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm font-bold text-gray-700">Pay Till:</label>
            <input 
              type="date" 
              value={payTill}
              onChange={(e) => setPayTill(e.target.value)}
              className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white"
            />
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
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectAll(checked);
                        const newSelected = {};
                        if (checked) {
                          students.forEach(student => {
                            newSelected[student.id] = true;
                          });
                        }
                        setSelectedStudents(newSelected);
                      }}
                      className="w-4 h-4" 
                    />
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Roll Number</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Name</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Previous Fee Due</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Current Fee Due ({feeMonths.filter(month => selectedMonths[month.id]).map(m => m.month_name).join(', ')})</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Remaining Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const currentFee = Object.values(studentFees[student.id] || {}).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0);
                  const previousFee = previousDues[student.id] || 0;
                  const totalAmount = previousFee + currentFee;
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedStudents[student.id] || false}
                          onChange={(e) => {
                            setSelectedStudents(prev => ({ ...prev, [student.id]: e.target.checked }));
                            if (!e.target.checked) setSelectAll(false);
                          }}
                          className="w-4 h-4" 
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">{student.roll_no}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs">{`${student.first_name || ''} ${student.last_name || ''}`.trim()}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">{previousFee.toFixed(2)}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">{currentFee.toFixed(2)} ({feeMonths.filter(month => selectedMonths[month.id]).map(m => m.month_name).join(', ')})</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">{previousFee.toFixed(2)}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">{totalAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <BlueBtn onClick={printPreBill} color="bg-green-600">
          PRINT PRE-BILL
        </BlueBtn>
      </div>

      {students.length > 0 && Object.keys(selectedStudents).some(id => selectedStudents[id]) && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Bill Preview (Half A4 Size)</h3>
          <div className="flex flex-wrap gap-4">
            {students.filter(student => selectedStudents[student.id]).map(student => {
              const currentFee = Object.values(studentFees[student.id] || {}).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0);
              const previousFee = previousDues[student.id] || 0;
              const totalAmount = previousFee + currentFee;
              const selectedMonthNames = feeMonths.filter(month => selectedMonths[month.id]).map(m => m.month_name).join(', ');
              
              return (
                <div key={student.id} className="w-[210mm] h-[296mm] border border-gray-400 p-2 bg-white relative" style={{transform: 'scale(0.3)', transformOrigin: 'top left', marginBottom: '-207mm', marginRight: '-147mm'}}>
                  <div className="border border-black p-5 h-full flex flex-col text-sm">
                    <div className="text-center mb-4">
                      <img src={schoolDetails.logo_url || '/logo.png'} className="w-12 h-12 mx-auto mb-2" />
                      <div className="font-bold text-lg">{schoolDetails.school_name || form.school}</div>
                      <div className="text-sm text-gray-600">{schoolDetails.address || 'School Address'}</div>
                      <div className="text-sm text-gray-600">Phone: {schoolDetails.phone || 'N/A'} | Email: {schoolDetails.email || 'N/A'}</div>
                      <div className="absolute top-0 right-0 text-xs font-bold text-black">PAN: {schoolDetails.pan_no || 'N/A'}</div>
                      <div className="border-b-2 border-blue-500 w-full mt-3"></div>
                    </div>
                    <div className="mb-4">
                      <table className="w-full text-sm text-black">
                        <tbody>
                          <tr>
                            <td><strong>Name:</strong> {student.first_name} {student.last_name}</td>
                            <td><strong>Bill No:</strong> {Math.floor(Math.random() * 100000)}</td>
                            <td><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</td>
                          </tr>
                          <tr>
                            <td><strong>Class:</strong> {form.class}/{form.section}</td>
                            <td><strong>Roll No:</strong> {student.roll_no}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex-1">
                      <table className="w-full border-collapse border border-black text-sm mb-3">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-black p-2">S/No</th>
                            <th className="border border-black p-2">Description</th>
                            <th className="border border-black p-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(studentFees[student.id] || {}).map((feeHeadId, index) => {
                            const feeHead = feeHeads.find(fh => fh.id == feeHeadId);
                            const amount = studentFees[student.id][feeHeadId];
                            return (
                              <tr key={feeHeadId}>
                                <td className="border border-black p-2 text-center">{index + 1}</td>
                                <td className="border border-black p-2">{feeHead?.fee_head || 'Fee'}</td>
                                <td className="border border-black p-2 text-right">Rs. {amount}</td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td colSpan={2} className="border border-black p-2 text-right font-bold">This Month's Total:</td>
                            <td className="border border-black p-2 text-right font-bold">Rs. {currentFee.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="border border-black p-2 text-right font-bold">Previous Dues:</td>
                            <td className="border border-black p-2 text-right font-bold">Rs. {previousFee.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="border border-black p-2 text-right font-bold">Total Amount:</td>
                            <td className="border border-black p-2 text-right font-bold">Rs. {totalAmount.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="text-sm mb-3">
                        <strong>Amount In Words:</strong> {numberToWords(Math.floor(totalAmount))} Rupees {totalAmount % 1 !== 0 ? 'and ' + Math.round((totalAmount % 1) * 100) + ' Paisa' : ''} Only
                        {payTill && <><br /><strong>Pay Till:</strong> {new Date(payTill).toLocaleDateString('en-GB')}</>}
                      </div>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-sm">
                      <div className="flex justify-between mb-2">
                        <span>Cash/Cheque/DD Collected by admin</span>
                        <span>Authorized Signatory</span>
                      </div>
                      <div className="bg-gray-100 p-2 text-center font-bold">Note: Please pay fees on time</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintPreBill;