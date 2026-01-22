import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseService } from '../lib/supabase';

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

const FeeSubmit: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    school: 'JHOR HIGH SCHOOL',
    batch: '2080',
    class: '1',
    section: 'A',
    firstName: '',
    lastName: '',
    rollNo: '',
    billNo: '',
    receiptNo: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash'
  });

  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [feeHeads, setFeeHeads] = useState<any[]>([]);
  const [feeMonths, setFeeMonths] = useState<any[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<{[monthId: string]: boolean}>({});
  const [paymentAmounts, setPaymentAmounts] = useState<{[key: string]: string}>({});
  const [submittedPayments, setSubmittedPayments] = useState<{[key: string]: number}>({});
  const [feeReceived, setFeeReceived] = useState<{[key: string]: number}>({});

  const [schoolDetails, setSchoolDetails] = useState<any>(null);

  useEffect(() => {
    fetchSchools();
    fetchBatches();
    fetchClasses();
    fetchSections();
    fetchFeeHeads();
    fetchFeeMonths();
  }, []);

  useEffect(() => {
    if (form.school) {
      fetchSchoolDetails();
    }
  }, [form.school]);

  const fetchSchoolDetails = async () => {
    try {
      if (!form.school) {
        setSchoolDetails(null);
        return;
      }
      
      const { data, error } = await supabaseService.supabase
        .from('schools')
        .select('*')
        .eq('school_name', form.school)
        .single();
      if (error) {
        console.error('Error fetching school details:', error);
        setSchoolDetails(null);
        return;
      }
      setSchoolDetails(data);
    } catch (e) {
      console.error('Error fetching school details:', e);
      setSchoolDetails(null);
    }
  };

  useEffect(() => {
    if (form.school && form.batch && form.class && form.section) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [form.school, form.batch, form.class, form.section]);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentFees();
      loadFeeReceived();
    }
  }, [selectedStudent]);

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

  const fetchStudents = async () => {
    try {
      let query = supabaseService.supabase
        .from('students')
        .select('*');
      
      if (form.school) query = query.eq('school', form.school);
      if (form.batch) query = query.eq('batch_no', form.batch);
      if (form.class) query = query.eq('class', form.class);
      if (form.section) query = query.eq('section', form.section);
      if (form.firstName) query = query.ilike('first_name', `%${form.firstName}%`);
      if (form.lastName) query = query.ilike('last_name', `%${form.lastName}%`);
      if (form.rollNo) query = query.eq('roll_no', form.rollNo);
      
      const { data, error } = await query.order('roll_no');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (e) {
      console.error('Error fetching students:', e);
    }
  };

  const loadStudentFees = async () => {
    try {
      if (!selectedStudent) {
        setStudentFees([]);
        return;
      }

      const { data, error } = await supabaseService.supabase
        .from('student_variable_fees')
        .select('*')
        .eq('student_id', selectedStudent.id);
      
      if (error) throw error;
      setStudentFees(data || []);
      
      // Load submitted payments for this student
      await loadSubmittedPayments();
    } catch (e) {
      console.error('Error loading student fees:', e);
      setStudentFees([]);
    }
  };

  const loadSubmittedPayments = async () => {
    try {
      if (!selectedStudent) return;
      
      const { data, error } = await supabaseService.supabase
        .from('fee_payments')
        .select('*')
        .eq('student_id', selectedStudent.id);
      
      if (error) throw error;
      
      // Group payments by month and fee head
      const payments = {};
      (data || []).forEach(payment => {
        const key = (payment.month_name || '') + '_' + (payment.fee_head || '');
        payments[key] = (payments[key] || 0) + parseFloat(payment.amount || 0);
      });
      
      setSubmittedPayments(payments);
    } catch (e) {
      console.error('Error loading submitted payments:', e);
    }
  };

  const loadFeeReceived = async () => {
    try {
      if (!selectedStudent) return;
      
      const { data, error } = await supabaseService.supabase
        .from('fee_payments')
        .select('*')
        .eq('student_id', selectedStudent.id);
      
      if (error) throw error;
      
      // Group received amounts by month and fee head
      const received = {};
      (data || []).forEach(payment => {
        const key = (payment.month_name || '') + '_' + (payment.fee_head || '');
        received[key] = (received[key] || 0) + parseFloat(payment.amount || 0);
      });
      
      setFeeReceived(received);
    } catch (e) {
      console.error('Error loading fee received:', e);
    }
  };

  const openInstalmentFeeWindow = async (student: any) => {
    // Set selected student and load fees first
    setSelectedStudent(student);
    
    // Load student fees from database
    const { data: fees, error } = await supabaseService.supabase
      .from('student_variable_fees')
      .select('*')
      .eq('student_id', student.id);
    
    if (error) {
      console.error('Error loading student fees:', error);
      return;
    }
    
    const currentStudentFees = fees || [];
    
    const popup = window.open('', '_blank', 'toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,copyhistory=yes,width=1200,height=800');
    
    // Pass student fees data to popup
    popup.studentFeesData = currentStudentFees;
    popup.feeHeadsData = feeHeads;
    popup.feeMonthsData = feeMonths;
    popup.selectedStudentId = student.id;
    
    // Pass submitted payments to popup
    const { data: currentSubmittedPayments, error: paymentsError } = await supabaseService.supabase
      .from('fee_payments')
      .select('*')
      .eq('student_id', student.id);
    
    const submittedPaymentsForPopup = {};
    if (!paymentsError && currentSubmittedPayments) {
      currentSubmittedPayments.forEach(payment => {
        const key = (payment.month_name || '') + '_' + (payment.fee_head || '');
        submittedPaymentsForPopup[key] = (submittedPaymentsForPopup[key] || 0) + parseFloat(payment.amount || 0);
      });
    }
    
    popup.submittedPayments = submittedPaymentsForPopup;
    
    // Make school details available to popup
    popup.schoolDetails = schoolDetails;
    
    // Pass callback function for saving payments
    popup.savePaymentCallback = async (paymentData, selectedFees) => {
      try {
        console.log('savePaymentCallback called with:', paymentData, selectedFees);
        
        // Check for existing payments and calculate remaining amounts
        const { data: existingPayments, error: checkError } = await supabaseService.supabase
          .from('fee_payments')
          .select('month_name, fee_head, amount')
          .eq('student_id', paymentData.student_id);
        
        if (checkError) {
          console.error('Error checking existing payments:', checkError);
        }
        
        // Get student fees to check remaining amounts
        const { data: studentFees, error: feesError } = await supabaseService.supabase
          .from('student_variable_fees')
          .select('*')
          .eq('student_id', paymentData.student_id);
        
        // Get fee heads and months for matching
        const { data: feeHeadsData } = await supabaseService.supabase.from('fee_heads').select('*');
        const { data: feeMonthsData } = await supabaseService.supabase.from('fee_months').select('*');
        
        // Filter out fully paid fees
        const newFees = selectedFees.filter(fee => {
          // Find the student fee record
          const feeHeadObj = feeHeadsData?.find(fh => fh.fee_head === fee.head);
          const monthObj = feeMonthsData?.find(m => m.month_name === fee.month);
          
          if (!feeHeadObj || !monthObj) return false;
          
          const studentFee = studentFees?.find(sf => 
            sf.month_id === monthObj.id && sf.fee_head_id === feeHeadObj.id
          );
          
          if (!studentFee) return false; // No fee record found
          
          // Calculate total paid for this fee
          const totalPaid = existingPayments?.filter(ep => 
            ep.month_name === fee.month && ep.fee_head === fee.head
          ).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) || 0;
          
          const remainingAmount = parseFloat(studentFee.amount) - totalPaid;
          
          return remainingAmount > 0; // Only allow if there's remaining amount
        });
        
        if (newFees.length === 0) {
          alert('All selected fees have already been submitted!');
          return { success: false };
        }
        
        if (newFees.length < selectedFees.length) {
          const skipped = selectedFees.length - newFees.length;
          alert(`${skipped} fee(s) already submitted. Saving only new fees.`);
        }
        
        // Save each new fee as separate record
        const paymentRecords = newFees.map(fee => ({
          student_id: paymentData.student_id,
          receipt_no: paymentData.receipt_no,
          receipt_date: paymentData.receipt_date,
          month_name: fee.month,
          fee_head: fee.head,
          amount: fee.amount,
          remaining_amount: fee.remainingAmount || 0,
          fine_amount: paymentData.fine_amount,
          discount_amount: paymentData.discount_amount,
          other_amount: paymentData.other_amount,
          payment_mode: paymentData.payment_mode,
          school: paymentData.school,
          batch: paymentData.batch,
          class: paymentData.class,
          section: paymentData.section,
          created_at: paymentData.created_at
        }));
        
        // Save to fee_payments table
        const { data: paymentResult, error: paymentError } = await supabaseService.supabase
          .from('fee_payments')
          .insert(paymentRecords)
          .select();
        
        console.log('Payment insert result:', paymentResult, 'Error:', paymentError);
        
        if (paymentError) {
          console.error('Payment error:', paymentError);
          throw paymentError;
        }
        
        // Reload submitted payments after saving
        await loadSubmittedPayments();
        await loadFeeReceived();
        
        // Fetch updated submitted payments for popup
        const { data: updatedPayments, error: fetchError } = await supabaseService.supabase
          .from('fee_payments')
          .select('*')
          .eq('student_id', student.id);
        
        if (!fetchError) {
          const payments = {};
          (updatedPayments || []).forEach(payment => {
            const key = (payment.month_name || '') + '_' + (payment.fee_head || '');
            payments[key] = (payments[key] || 0) + parseFloat(payment.amount || 0);
          });
          popup.submittedPayments = payments;
        }
        
        console.log('Payment saved successfully');
        return { success: true };
      } catch (error) {
        console.error('Error in savePaymentCallback:', error);
        throw error;
      }
    };
    
    // Wait for popup to load before writing content
    popup.onload = function() {
      popup.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Fees Submit Details</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; font-size: 14px; font-weight: 600; }
          .container { background: white; padding: 20px; width: 100%; margin: 0; min-height: 100vh; }
          .header { font-size: 18px; font-weight: bold; color: #2980b9; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #2980b9; padding-bottom: 10px; }
          .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
          .detail-item { display: flex; font-size: 14px; font-weight: bold; }
          .label { font-weight: bold; min-width: 100px; }
          .value { color: #333; }
          .months-list { background: #f0f0f0; padding: 15px; margin: 10px 0; font-size: 11px; border-radius: 5px; }
          .section-title { font-weight: bold; margin: 15px 0 10px 0; color: #333; font-size: 16px; }
          table { width: 100%; table-layout: fixed; border-collapse: collapse; margin: 10px 0; min-width: 800px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: center; font-size: 12px; }
          th { background: #f3f4f6; font-weight: bold; color: #374151; }
          td { font-weight: normal; }
          @media (max-width: 768px) {
            .container { padding: 10px; }
            .details-grid { grid-template-columns: 1fr; gap: 10px; }
            table { min-width: 600px; }
            th, td { padding: 4px; font-size: 10px; }
            input[type="number"] { width: 40px !important; font-size: 9px; }
          }
          @media (max-width: 480px) {
            table { min-width: 500px; }
            th, td { padding: 2px; font-size: 8px; }
            input[type="number"] { width: 35px !important; font-size: 8px; }
          }
          .payment-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .payment-item { display: flex; flex-direction: column; }
          .payment-item label { font-size: 12px; font-weight: bold; margin-bottom: 5px; color: #374151; }
          .payment-item input { padding: 8px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 4px; width: 100%; }
          .submit-btn { background: #3498db; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin: 15px 10px; transition: background 0.3s; font-size: 14px; }
          .submit-btn:hover { background: #2980b9; }
          .totals { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #dee2e6; }
          .totals input { border: 1px solid #d1d5db; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Student Fees Submit Details</div>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">School :</span>
              <span class="value">${form.school}</span>
            </div>
            <div class="detail-item">
              <span class="label">Batch :</span>
              <span class="value">${form.batch}</span>
            </div>
            <div class="detail-item">
              <span class="label">Class :</span>
              <span class="value">${form.class}</span>
            </div>
            <div class="detail-item">
              <span class="label">Section :</span>
              <span class="value">${form.section}</span>
            </div>
            <div class="detail-item">
              <span class="label">Fee Category :</span>
              <span class="value">General</span>
            </div>
            <div class="detail-item">
              <span class="label">Student Name :</span>
              <span class="value">${student.first_name} ${student.last_name}</span>
            </div>
            <div class="detail-item">
              <span class="label">SRN :</span>
              <span class="value">${student.roll_no}</span>
            </div>
          </div>
          <div class="months-list">
            <h4 style="font-weight: bold; margin-bottom: 10px;">Select Months</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              ${feeMonths.sort((a, b) => (a.month_order || 0) - (b.month_order || 0)).map(month => `
                <div style="display: flex; align-items: center;">
                  <input type="checkbox" id="month-${month.id}" class="month-checkbox" value="${month.id}" style="margin-right: 5px;" onchange="loadFeesForSelectedMonths()">
                  <label for="month-${month.id}" style="font-size: 11px; cursor: pointer;">${month.month_name}</label>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="section-title">Fees Details</div>
          <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: calc(100% - 30px); margin: 0 auto;">
            <table id="fees-table" style="width: 100%; table-layout: fixed; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;">SlNo.</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;"><input type="checkbox" id="select-all" onchange="toggleAllCheckboxes(this)"> Select All</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;">Fee Instalment</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;">Fee Head</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;">Fee Amount</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;">Fees Submitted</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;">Current Fees</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; background: #f3f4f6; font-size: 12px; font-weight: bold; color: #374151;">Amount Remaining</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          
          <div class="section-title">Previous Fee Details</div>
          <div style="padding:10px; background:#f9f9f9; text-align:center; font-style:italic;">No record found</div>
          
          <div class="payment-grid">
            <div class="payment-item">
              <label>M Receipt No:</label>
              <input type="text" id="m-receipt-no" placeholder="Manual Receipt" value="${Date.now()}" onchange="updateReceiptNumber()">
            </div>
            <div class="payment-item">
              <label>E Receipt No.:</label>
              <input type="text" placeholder="Electronic Receipt">
            </div>
            <div class="payment-item">
              <label>Receipt Date:</label>
              <input type="date" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="payment-item">
              <label>Receipt Manual Date:</label>
              <input type="date">
            </div>
          </div>
          
          <div class="totals">
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; font-size:11px;">
              <div><label>Due Amount:</label><br><input type="number" id="due-amount" value="0" style="width:80px; padding:2px;" readonly></div>
              <div><label>Fine Amount:</label><br><input type="number" id="fine-amount" value="0" style="width:80px; padding:2px;" onchange="updateTotalWithDiscount()"></div>
              <div><label>Discount:</label><br><input type="number" id="discount" value="0" style="width:80px; padding:2px;" onchange="updateTotalWithDiscount()"></div>
              <div><label>Other Amount:</label><br><input type="number" id="other-amount" value="0" style="width:80px; padding:2px;" onchange="updateTotalWithDiscount()"></div>
              <div><label>Total Fees:</label><br><input type="number" id="total-fees" value="0" style="width:80px; padding:2px;" readonly></div>
              <div><label>Prev Balance:</label><br><input type="number" id="prev-balance" value="0" style="width:80px; padding:2px;" readonly></div>
              <div><label>Net Payable Fee:</label><br><input type="number" id="net-payable" value="0" style="width:80px; padding:2px;" readonly></div>
              <div><label>Pay Amount:</label><br><input type="number" id="pay-amount" value="0" style="width:80px; padding:2px;" onchange="updateBalanceAmount()"></div>
              <div><label>Balance Amount:</label><br><input type="number" id="balance-amount" value="0" style="width:80px; padding:2px;" readonly></div>
              <div><label>Remaining Amount:</label><br><input type="number" id="remaining-amount" value="0" style="width:80px; padding:2px;" readonly></div>
              <div><label>Remarks:</label><br><input type="text" style="width:120px; padding:2px;"></div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <button class="submit-btn" onclick="openReceiptWindow()">Submit and Print</button>
            <button class="submit-btn" style="background:#6c757d" onclick="window.close()">Cancel</button>
          </div>
        </div>
        <script>
          // Auto-load fees when popup opens
          window.addEventListener('load', function() {
            // Show empty table initially
            document.querySelector('tbody').innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">Please select months to view fees</td></tr>';
          });
          
          function loadStudentFeesIntoTable() {
            const studentFees = window.studentFeesData || [];
            const feeHeads = window.feeHeadsData || [];
            const feeMonths = window.feeMonthsData || [];
            
            if (studentFees.length === 0) {
              document.querySelector('tbody').innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">No fees found for this student</td></tr>';
              return;
            }
            
            let tableRows = '';
            let totalDueAmount = 0;
            
            studentFees.forEach((fee, index) => {
              const feeHead = feeHeads.find(fh => fh.id == fee.fee_head_id);
              const month = feeMonths.find(m => m.id == fee.month_id);
              const feeAmount = parseFloat(fee.amount);
              totalDueAmount += feeAmount;
              
              tableRows += '<tr><td>' + (index + 1) + '</td><td><input type="checkbox" onchange="updateTotalsFromSelection()"></td><td>' + (month?.month_name || 'Unknown') + '</td><td>' + (feeHead?.fee_head || 'Unknown') + '</td><td>' + feeAmount + '</td><td>0</td><td><input type="number" value="' + feeAmount + '" style="width:60px" onchange="calculateRemaining(this, ' + (index + 1) + '); updateTotalsFromSelection();"></td><td id="remaining-' + (index + 1) + '">0</td></tr>';
            });
            
            tableRows += '<tr style="font-weight:bold"><td colspan="4">Total Fees :</td><td>' + totalDueAmount + '</td><td>0</td><td id="total-current">' + totalDueAmount + '</td><td id="total-remaining">0</td></tr>';
            
            document.querySelector('tbody').innerHTML = tableRows;
            
            // Update totals section
            document.getElementById('due-amount').value = totalDueAmount;
            document.getElementById('total-fees').value = totalDueAmount;
            document.getElementById('net-payable').value = totalDueAmount;
            document.getElementById('pay-amount').value = totalDueAmount;
            document.getElementById('balance-amount').value = 0;
            document.getElementById('remaining-amount').value = 0;
          }
          
          const feeAmounts = [5000, 1000, 180, 5000, 180, 1000];
          
          function openReceiptWindow() {
            // Get selected fees and group by fee head
            const selectedFees = [];
            const feeRows = document.querySelectorAll('tbody tr:not(:last-child)');
            
            feeRows.forEach((row, index) => {
              const checkbox = row.querySelector('input[type="checkbox"]');
              if (checkbox && checkbox.checked) {
                const month = row.cells[2].textContent;
                const feeHead = row.cells[3].textContent;
                const amount = parseFloat(row.querySelector('input[type="number"]').value) || 0;
                const remainingAmount = parseFloat(row.cells[7].textContent) || 0;
                
                // Find month and fee head IDs from window data
                const feeMonths = window.feeMonthsData || [];
                const feeHeads = window.feeHeadsData || [];
                const monthObj = feeMonths.find(m => m.month_name === month);
                const headObj = feeHeads.find(h => h.fee_head === feeHead);
                
                selectedFees.push({ 
                  month, 
                  head: feeHead, 
                  amount, 
                  remainingAmount,
                  monthId: monthObj?.id,
                  headId: headObj?.id
                });
              }
            });
            
            if (selectedFees.length === 0) {
              alert('Please select at least one fee to submit');
              return;
            }
            
            // Save payment records to Supabase and update table
            savePaymentRecords(selectedFees).then(() => {
              // Update the table display after successful payment
              updateTableAfterPayment(selectedFees);
              // Group fees by fee head
              const feeGroups = {};
              selectedFees.forEach(fee => {
                if (!feeGroups[fee.head]) {
                  feeGroups[fee.head] = { months: [], totalAmount: 0 };
                }
                if (!feeGroups[fee.head].months.includes(fee.month)) {
                  feeGroups[fee.head].months.push(fee.month);
                }
                feeGroups[fee.head].totalAmount += fee.amount;
              });
              
              const totalAmount = selectedFees.reduce((sum, fee) => sum + fee.amount, 0);
              const totalRemainingAmount = selectedFees.reduce((sum, fee) => sum + (fee.remainingAmount || 0), 0);
              const amountInWords = numberToWords(totalAmount);
              
              const receiptWindow = window.open('', '_blank', 'width=400,height=600,scrollbars=yes,resizable=yes');
              const schoolData = window.schoolDetails || window.opener?.schoolDetails;
              const schoolName = schoolData?.school_name || '${form.school}';
              const schoolAddress = schoolData?.address || 'School Address';
              const schoolEmail = schoolData?.email || '';
              const schoolLogo = schoolData?.logo_url || '';
              const schoolPAN = schoolData?.pan_no || '';
              
              // Generate receipt rows from grouped fees
              const receiptRows = Object.entries(feeGroups).map(([feeHead, data], index) => 
                '<tr><td>' + (index + 1) + '.</td><td>' + data.months.join(', ') + '</td><td>' + feeHead + '</td><td class="moveright">Rs. ' + data.totalAmount + '</td></tr>'
              ).join('');
              
              receiptWindow.document.write('<!DOCTYPE html><html><head><title>Fee Receipt</title><style>body{font-family:arial,helvetica,serif;margin:0;padding:0;background-color:#fff}.bill{height:132mm;width:90mm;border:1px solid #000;margin:2px;padding:5px;margin-top:8px;position:relative}.row:after{content:"";display:table;clear:both}.col-md-2,.col-md-10,.col-md-8,.col-md-10{float:left}.img1{width:auto;height:50px;margin:2px;margin-top:2px;margin-right:6px}.header{margin-top:3px}.col-md-10{width:80%}.name{font-size:16px;font-weight:bold;text-align:left;overflow:hidden}.address{font-size:12px;font-weight:bold}.email{font-size:10px;font-weight:normal;color:#666}.col-md-12{width:100%}.col-md-8{width:65%}.lineheight{line-height:18px}.nametop{margin-top:3px;margin-bottom:2px;line-height:18px;float:left}.bornone{border:none;padding:0;margin-left:4px}.tdspace{font-size:12px;font-weight:bold;padding-right:5px}.padspace{margin-right:4px}.roll,.ten{font-size:12px;font-weight:bold}.content{position:relative;min-height:280px}table,td,th,tr{border:1px solid #000000;border-collapse:collapse}.tab{width:100%}table{margin:auto}.table1{margin-bottom:32px}th{padding:1px;font-size:10px;background-color:#808080;color:#000000}td{padding:2px 4px 2px 4px;font-size:10px;height:12%}.moveright{text-align:right;font-size:10px;font-weight:bold}.cheque,.author{font-size:10px}.cite{font-size:10px;background-color:#808080;color:#000000;padding:5px;font-weight:bold;bottom:0px;width:332px;margin-bottom:2px}@media print{@page{size:A6}.bill{page-break-after:always}}</style></head><body onload="window.print()"><div class="bill"><div class="header"><div class="row"><div class="col-md-2"><div class="logo">' + (schoolLogo ? '<img src="' + schoolLogo + '" class="img1">' : '') + '</div></div><div class="col-md-12 lineheight"><div class="name">' + schoolName + '</div><div class="address">' + schoolAddress + '</div>' + (schoolEmail ? '<div class="email">' + schoolEmail + '</div>' : '') + '</div><div class="row nametop"><div class="col-md-12"><table class="bornone"><tbody><tr class="bornone"><td class="bornone tdspace" colspan="2" style="width:200px;"><span class="padspace">PAN:</span><span>' + schoolPAN + '</span></td><td class="bornone tdspace" colspan="1"><span class="padspace">Date:</span><span>' + new Date().toLocaleDateString() + '</span></td></tr><tr class="bornone"><td class="bornone tdspace" colspan="2" style="width:200px;"><span class="padspace">Name:</span><span>' + '${student.first_name} ${student.last_name}' + '</span></td><td class="bornone tdspace" colspan="1"><span class="padspace">Class:</span><span>' + '${form.class}' + '</span></td></tr><tr class="bornone"><td class="bornone tdspace" style="width:100px;"><span class="padspace">Receipt:</span><span id="receipt-display">' + document.getElementById('m-receipt-no').value + '</span></td><td class="bornone tdspace" style="width:100px;text-align:center;"><span class="padspace">Roll No:</span><span>' + '${student.roll_no}' + '</span></td><td class="bornone tdspace"><span class="padspace">Sec.:</span><span>' + '${form.section}' + '</span></td></tr></tbody></table></div></div></div></div><div class="content"><div class="table1"><table class="tab"><thead><tr><th>S/No</th><th>MONTH</th><th>PARTICULARS</th><th>AMOUNT</th></tr></thead><tbody>' + receiptRows + '<tr><td colspan="3" class="moveright">Total Amount:</td><td class="moveright">Rs. ' + totalAmount + '</td></tr><tr><td colspan="3" class="moveright">Other Amount:</td><td class="moveright">Rs. ' + (parseFloat(document.getElementById('other-amount').value) || 0) + '</td></tr><tr><td colspan="3" class="moveright">Fine Amount:</td><td class="moveright">Rs. ' + (parseFloat(document.getElementById('fine-amount').value) || 0) + '</td></tr><tr><td colspan="3" class="moveright">Net Payable Amount:</td><td class="moveright">Rs. ' + (totalAmount + (parseFloat(document.getElementById('other-amount').value) || 0) + (parseFloat(document.getElementById('fine-amount').value) || 0) - (parseFloat(document.getElementById('discount').value) || 0)) + '</td></tr><tr><td colspan="3" class="moveright">Paid Amount:</td><td class="moveright">Rs. ' + totalAmount + '</td></tr><tr><td colspan="3" class="moveright">Remaining Amount:</td><td class="moveright">Rs. ' + totalRemainingAmount + '</td></tr><tr><td colspan="2" style="font-size:10px;font-weight:bold;padding:10px;">Amount In Words:</td><td colspan="2">' + amountInWords + ' Only/-</td></tr></tbody></table></div></div><div id="fixedbottom"><div class="cash"><div class="row"><div class="cheque col-md-8">Cash/Cheque/DD Collected by admin</div><div class="author col-md-4">Authorized Signatory</div></div></div><div class="cite"><cite>Note: </cite></div></div></div></body></html>');
              receiptWindow.document.close();
              
              alert('Payment Submitted Successfully!');
              window.close();
            }).catch(error => {
              console.error('Error saving payment:', error);
              alert('Error saving payment: ' + error.message);
            });
          }
          
          async function savePaymentRecords(selectedFees) {
            try {
              console.log('savePaymentRecords called with selectedFees:', selectedFees);
              
              const receiptNo = document.getElementById('m-receipt-no').value;
              const receiptDate = document.querySelector('input[type="date"]').value;
              const payAmount = parseFloat(document.getElementById('pay-amount').value) || 0;
              const fineAmount = parseFloat(document.getElementById('fine-amount').value) || 0;
              const discount = parseFloat(document.getElementById('discount').value) || 0;
              const otherAmount = parseFloat(document.getElementById('other-amount').value) || 0;
              
              console.log('Form values:', { receiptNo, receiptDate, payAmount, fineAmount, discount, otherAmount });
              
              // Create payment record
              const paymentRecord = {
                student_id: window.selectedStudentId,
                receipt_no: receiptNo,
                receipt_date: receiptDate,
                total_amount: payAmount,
                fine_amount: fineAmount,
                discount_amount: discount,
                other_amount: otherAmount,
                payment_mode: 'Cash',
                school: '${form.school}',
                batch: '${form.batch}',
                class: '${form.class}',
                section: '${form.section}',
                created_at: new Date().toISOString()
              };
              
              console.log('Payment record to save:', paymentRecord);
              
              // Use callback function from parent window
              if (window.savePaymentCallback) {
                console.log('Calling savePaymentCallback...');
                await window.savePaymentCallback(paymentRecord, selectedFees);
                console.log('savePaymentCallback completed successfully');
              } else {
                console.error('savePaymentCallback not found on window object');
                throw new Error('Payment callback not available');
              }
              
            } catch (error) {
              console.error('Error in savePaymentRecords:', error);
              throw error;
            }
          }
          
          function numberToWords(num) {
            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            
            if (num === 0) return 'Zero';
            
            function convertHundreds(n) {
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
            }
            
            let result = '';
            if (num >= 10000000) {
              result += convertHundreds(Math.floor(num / 10000000)) + 'Crore ';
              num %= 10000000;
            }
            if (num >= 100000) {
              result += convertHundreds(Math.floor(num / 100000)) + 'Lakh ';
              num %= 100000;
            }
            if (num >= 1000) {
              result += convertHundreds(Math.floor(num / 1000)) + 'Thousand ';
              num %= 1000;
            }
            if (num > 0) {
              result += convertHundreds(num);
            }
            
            return result.trim();
          }
          
          function calculateRemaining(input, rowIndex) {
            const currentFee = parseFloat(input.value) || 0;
            const row = input.closest('tr');
            const feeAmountCell = row.cells[4];
            const feeAmount = parseFloat(feeAmountCell.textContent) || 0;
            const remaining = feeAmount - currentFee;
            
            const remainingCell = row.cells[7];
            remainingCell.textContent = Math.max(0, remaining);
            
            updateTableTotals();
            updateTotalsFromSelection();
          }
          
          function updateTableTotals() {
            let totalCurrent = 0;
            let totalRemaining = 0;
            
            const rows = document.querySelectorAll('tbody tr:not(:last-child)');
            rows.forEach(row => {
              const currentInput = row.querySelector('input[type="number"]');
              const remainingCell = row.cells[7];
              
              if (currentInput && remainingCell) {
                const currentValue = parseFloat(currentInput.value) || 0;
                const remainingValue = parseFloat(remainingCell.textContent) || 0;
                
                totalCurrent += currentValue;
                totalRemaining += remainingValue;
              }
            });
            
            const totalCurrentCell = document.getElementById('total-current');
            const totalRemainingCell = document.getElementById('total-remaining');
            
            if (totalCurrentCell) totalCurrentCell.textContent = totalCurrent;
            if (totalRemainingCell) totalRemainingCell.textContent = totalRemaining;
          }
          
          function loadFeesForSelectedMonths() {
            const selectedMonthIds = [];
            const monthCheckboxes = document.querySelectorAll('.month-checkbox');
            monthCheckboxes.forEach(checkbox => {
              if (checkbox.checked) {
                selectedMonthIds.push(checkbox.value);
              }
            });
            
            if (selectedMonthIds.length === 0) {
              // If no months selected, show message
              document.querySelector('tbody').innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">Please select months to view fees</td></tr>';
              return;
            }
            
            const studentId = window.selectedStudentId;
            const studentFees = window.studentFeesData || [];
            const feeHeads = window.feeHeadsData || [];
            const feeMonths = window.feeMonthsData || [];
            
            // Filter fees by selected months
            const filteredFees = studentFees.filter(fee => selectedMonthIds.includes(fee.month_id.toString()));
            
            let tableRows = '';
            let totalDueAmount = 0;
            let totalSubmittedAmount = 0;
            let totalRemainingAmount = 0;
            
            if (filteredFees.length === 0) {
              document.querySelector('tbody').innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">No fees found for selected months</td></tr>';
              return;
            }
            
            // Get submitted payments from parent window
            const submittedPayments = window.submittedPayments || {};
            
            filteredFees.forEach((fee, index) => {
              const feeHead = feeHeads.find(fh => fh.id == fee.fee_head_id);
              const month = feeMonths.find(m => m.id == fee.month_id);
              const feeAmount = parseFloat(fee.amount);
              
              // Check for submitted payments
              const paymentKey = (month?.month_name || '') + '_' + (feeHead?.fee_head || '');
              const submittedAmount = submittedPayments[paymentKey] || 0;
              const remainingAmount = Math.max(0, feeAmount - submittedAmount);
              
              totalDueAmount += feeAmount;
              totalSubmittedAmount += submittedAmount;
              totalRemainingAmount += remainingAmount;
              
              tableRows += '<tr><td>' + (index + 1) + '</td><td><input type="checkbox" onchange="updateTotalsFromSelection()"></td><td>' + (month?.month_name || 'Unknown') + '</td><td>' + (feeHead?.fee_head || 'Unknown') + '</td><td>' + feeAmount + '</td><td>' + submittedAmount + '</td><td><input type="number" value="' + remainingAmount + '" style="width:60px" onchange="calculateRemaining(this, ' + (index + 1) + '); updateTotalsFromSelection();"></td><td id="remaining-' + (index + 1) + '">0</td></tr>';
            });
            
            tableRows += '<tr style="font-weight:bold"><td colspan="4">Total Fees :</td><td>' + totalDueAmount + '</td><td>' + totalSubmittedAmount + '</td><td id="total-current">' + totalRemainingAmount + '</td><td id="total-remaining">' + totalRemainingAmount + '</td></tr>';
            
            document.querySelector('tbody').innerHTML = tableRows;
            
            // Update totals section
            document.getElementById('due-amount').value = totalDueAmount;
            document.getElementById('total-fees').value = totalDueAmount;
            document.getElementById('net-payable').value = totalDueAmount;
            document.getElementById('pay-amount').value = 0;
            document.getElementById('balance-amount').value = totalDueAmount;
            document.getElementById('remaining-amount').value = totalDueAmount;
          }
          
          function toggleAllMonths(tickAllCheckbox) {
            const monthCheckboxes = document.querySelectorAll('.month-checkbox');
            monthCheckboxes.forEach(checkbox => {
              checkbox.checked = tickAllCheckbox.checked;
            });
            loadFeesForSelectedMonths();
          }
          
          function updateTotalWithDiscount() {
            const dueAmount = parseFloat(document.getElementById('due-amount').value) || 0;
            const discount = parseFloat(document.getElementById('discount').value) || 0;
            const otherAmount = parseFloat(document.getElementById('other-amount').value) || 0;
            const fineAmount = parseFloat(document.getElementById('fine-amount').value) || 0;
            const totalFees = dueAmount - discount + otherAmount + fineAmount;
            document.getElementById('total-fees').value = totalFees;
            document.getElementById('net-payable').value = totalFees;
            updateBalanceAmount();
          }
          
          function updateBalanceAmount() {
            const totalFees = parseFloat(document.getElementById('total-fees').value) || 0;
            const payAmount = parseFloat(document.getElementById('pay-amount').value) || 0;
            const balanceAmount = totalFees - payAmount;
            document.getElementById('balance-amount').value = balanceAmount;
          }
          
          function toggleAllCheckboxes(selectAllCheckbox) {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
              checkbox.checked = selectAllCheckbox.checked;
            });
            updateTotalsFromSelection();
          }
          
          function updateTotalsFromSelection() {
            let dueAmount = 0;
            let totalFees = 0;
            let payAmount = 0;
            let remainingAmount = 0;
            
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            
            checkboxes.forEach((checkbox, index) => {
              if (checkbox.checked) {
                const row = checkbox.closest('tr');
                const feeAmountCell = row.cells[4]; // Fee Amount column
                const currentFeeInput = row.querySelector('input[type="number"]');
                const remainingCell = row.cells[7]; // Amount Remaining column
                
                const feeAmount = parseFloat(feeAmountCell.textContent) || 0;
                const currentValue = parseFloat(currentFeeInput.value) || 0;
                const remaining = parseFloat(remainingCell.textContent) || 0;
                
                dueAmount += feeAmount;
                totalFees += currentValue; // Use current fee value instead of fee amount
                payAmount += currentValue;
                remainingAmount += remaining;
              }
            });
            
            // Update totals section
            document.getElementById('due-amount').value = dueAmount;
            document.getElementById('total-fees').value = totalFees;
            document.getElementById('net-payable').value = totalFees;
            document.getElementById('pay-amount').value = payAmount;
            document.getElementById('balance-amount').value = totalFees - payAmount;
            document.getElementById('remaining-amount').value = remainingAmount;
            
            // Apply discount and other amounts
            updateTotalWithDiscount();
          }
          
          function updateTableAfterPayment(selectedFees) {
            // Update table rows to reflect the payment
            const feeRows = document.querySelectorAll('tbody tr:not(:last-child)');
            
            feeRows.forEach((row, index) => {
              const checkbox = row.querySelector('input[type="checkbox"]');
              if (checkbox && checkbox.checked) {
                const month = row.cells[2].textContent;
                const feeHead = row.cells[3].textContent;
                const currentFeeInput = row.querySelector('input[type="number"]');
                const currentAmount = parseFloat(currentFeeInput.value) || 0;
                
                // Update Fees Submitted column (index 5)
                const feesSubmittedCell = row.cells[5];
                const currentSubmitted = parseFloat(feesSubmittedCell.textContent) || 0;
                const newSubmitted = currentSubmitted + currentAmount;
                feesSubmittedCell.textContent = newSubmitted;
                
                // Update Amount Remaining column (index 7)
                const feeAmount = parseFloat(row.cells[4].textContent) || 0;
                const newRemaining = feeAmount - newSubmitted;
                const remainingCell = row.cells[7];
                remainingCell.textContent = Math.max(0, newRemaining);
                
                // Reset Current Fees input to 0 and set max to remaining amount
                currentFeeInput.value = '0';
                currentFeeInput.max = Math.max(0, newRemaining);
                
                // Uncheck the checkbox
                checkbox.checked = false;
              }
            });
            
            // Update totals
            updateTableTotals();
            updateTotalsFromSelection();
            
            // Update parent window's submitted payments
            if (window.opener && window.opener.loadSubmittedPayments) {
              window.opener.loadSubmittedPayments();
            }
          }
          
          function updateReceiptNumber() {
            // This function can be used to update receipt number in real-time if needed
          }
        </script>
      </body>
      </html>
      `);
      popup.document.close();
    };
    
    // Fallback: write immediately if popup is already loaded
    if (popup.document && popup.document.readyState === 'complete') {
      popup.onload();
    }
  };

  const submitFeePayment = async () => {
    try {
      if (!selectedStudent) {
        alert('Please select a student');
        return;
      }

      if (!form.billNo || !form.receiptNo) {
        alert('Please enter Bill No and Receipt No');
        return;
      }

      const totalAmount = Object.values(paymentAmounts).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0);
      
      if (totalAmount <= 0) {
        alert('Please enter payment amounts');
        return;
      }

      // Create fee payment record
      const paymentRecord = {
        student_id: selectedStudent.id,
        bill_no: form.billNo,
        receipt_no: form.receiptNo,
        payment_date: form.paymentDate,
        payment_mode: form.paymentMode,
        total_amount: totalAmount,
        school: form.school,
        batch: form.batch,
        class: form.class,
        section: form.section,
        created_by: user.username,
        created_at: new Date().toISOString()
      };

      // Insert payment record (you may need to create this table)
      const { error: paymentError } = await supabaseService.supabase
        .from('fee_payments')
        .insert([paymentRecord]);

      if (paymentError) {
        console.error('Payment error:', paymentError);
        // Continue even if payment table doesn't exist
      }

      // Update student variable fees as paid
      for (const fee of studentFees) {
        const paymentAmount = parseFloat(paymentAmounts[`${fee.fee_head_id}_${fee.month_id}`] || '0');
        if (paymentAmount > 0) {
          // Mark as paid or reduce amount
          const newAmount = parseFloat(fee.amount) - paymentAmount;
          
          if (newAmount <= 0) {
            // Delete the fee record if fully paid
            await supabaseService.supabase
              .from('student_variable_fees')
              .delete()
              .eq('id', fee.id);
          } else {
            // Update with remaining amount
            await supabaseService.supabase
              .from('student_variable_fees')
              .update({ amount: newAmount })
              .eq('id', fee.id);
          }
        }
      }

      alert('Fee payment submitted successfully!');
      
      // Reset form
      setForm(prev => ({ ...prev, billNo: '', receiptNo: '' }));
      setPaymentAmounts({});
      loadStudentFees();
      
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert(`Error submitting payment: ${error.message}`);
    }
  };

  const getTotalDue = () => {
    return studentFees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
  };

  const getTotalPayment = () => {
    return Object.values(paymentAmounts).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0);
  };

  return (
    <div className="w-full">
      <div className="mb-6 relative pb-4">
        <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
          Fee Submit
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
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b">
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">First Name:</div>
            <div className="flex-1 px-2">
              <Input 
                type="text" 
                value={form.firstName}
                onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                placeholder="First Name"
              />
            </div>
          </div>
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Last Name:</div>
            <div className="flex-1 px-2">
              <Input 
                type="text" 
                value={form.lastName}
                onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="flex items-center h-10 bg-white">
            <div className="w-16 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Roll:</div>
            <div className="flex-1 px-2">
              <Input 
                type="text" 
                value={form.rollNo}
                onChange={(e) => setForm(p => ({ ...p, rollNo: e.target.value }))}
                placeholder="Roll No"
              />
            </div>
          </div>
        </div>
        <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
          <BlueBtn onClick={fetchStudents}>
            SEARCH
          </BlueBtn>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white border border-gray-300 mb-6">
          <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Student List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Roll No</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">First Name</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{student.roll_no}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{student.first_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <div className="flex gap-2">
                        <span 
                          onClick={() => {
                            setSelectedStudent(student);
                            loadStudentFees();
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                        >
                          Submit Fee
                        </span>
                        <span className="text-gray-400">|</span>
                        <span 
                          onClick={() => openInstalmentFeeWindow(student)}
                          className="text-orange-600 hover:text-orange-800 cursor-pointer underline"
                        >
                          Instalment Fee
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedStudent && studentFees.length > 0 && (
        <div className="bg-white border border-gray-300 mb-6">
          <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Fee Details - {selectedStudent.first_name} {selectedStudent.last_name}</h3>
            <div className="text-sm font-bold text-gray-700">
              Total Due: Rs. {getTotalDue().toFixed(2)} | Payment: Rs. {getTotalPayment().toFixed(2)}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">SlNo.</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Select All</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Fee Instalment</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Fee Head</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Fee Amount</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Fees Submitted</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Current Fees</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Amount Remaining</th>
                </tr>
              </thead>
              <tbody>
                {studentFees.map((fee, index) => {
                  const feeHead = feeHeads.find(fh => fh.id == fee.fee_head_id);
                  const month = feeMonths.find(m => m.id == fee.month_id);
                  const paymentKey = `${fee.fee_head_id}_${fee.month_id}`;
                  const submittedKey = (month?.month_name || '') + '_' + (feeHead?.fee_head || '');
                  const submittedAmount = submittedPayments[submittedKey] || 0;
                  const receivedAmount = feeReceived[submittedKey] || 0;
                  const remainingAmount = Math.max(0, parseFloat(fee.amount) - receivedAmount);
                  
                  return (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                        <input type="checkbox" className="fee-checkbox" />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">{month?.month_name || 'Unknown'}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs">{feeHead?.fee_head || 'Unknown'}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">Rs. {parseFloat(fee.amount).toFixed(2)}</td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">Rs. {submittedAmount.toFixed(2)}</td>
                      <td className="border border-gray-300 px-1 py-1 text-xs text-center">
                        <input 
                          type="number" 
                          min="0"
                          max={remainingAmount}
                          value={paymentAmounts[paymentKey] || ''}
                          onChange={(e) => setPaymentAmounts(prev => ({ ...prev, [paymentKey]: e.target.value }))}
                          className="w-full border border-gray-200 text-xs text-center focus:outline-none focus:border-blue-400 bg-white px-1 py-1"
                          placeholder="0"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-xs text-center">Rs. {remainingAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="bg-white border border-gray-300 mb-6">
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bill No*</label>
                <Input 
                  type="text" 
                  value={form.billNo}
                  onChange={(e) => setForm(p => ({ ...p, billNo: e.target.value }))}
                  placeholder="Enter Bill Number"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Receipt No*</label>
                <Input 
                  type="text" 
                  value={form.receiptNo}
                  onChange={(e) => setForm(p => ({ ...p, receiptNo: e.target.value }))}
                  placeholder="Enter Receipt Number"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Date*</label>
                <Input 
                  type="date" 
                  value={form.paymentDate}
                  onChange={(e) => setForm(p => ({ ...p, paymentDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Mode*</label>
                <Select value={form.paymentMode} onChange={(e) => setForm(p => ({ ...p, paymentMode: e.target.value }))}>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="DD">DD</option>
                  <option value="Online">Online</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default FeeSubmit;