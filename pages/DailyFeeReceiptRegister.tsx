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

const DailyFeeReceiptRegister: React.FC<{ user: User }> = ({ user }) => {
  const [form, setForm] = useState({
    school: 'JHOR HIGH SCHOOL',
    batch: '2080',
    class: '1',
    section: 'A',
    fromDate: '',
    toDate: ''
  });

  const [schools, setSchools] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [feePayments, setFeePayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previousDues, setPreviousDues] = useState<{[studentId: string]: number}>({});

  const loadPreviousDues = async (studentIds: string[]) => {
    try {
      if (studentIds.length === 0) {
        setPreviousDues({});
        return;
      }
      
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

  useEffect(() => {
    fetchSchools();
    fetchBatches();
    fetchClasses();
    fetchSections();
  }, []);

  const fetchSchools = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('schools')
          .select('*')
          .eq('id', user.school_id);
        if (error) throw error;
        setSchools(data || []);
        if (data && data.length > 0) {
          setForm(prev => ({ ...prev, school: data[0].school_name }));
        }
      } else {
        setSchools([]);
      }
    } catch (e) {
      console.error('Error fetching schools:', e);
    }
  };

  const fetchBatches = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.getBatches(user.school_id);
        if (error) throw error;
        setBatches(data || []);
      } else {
        setBatches([]);
      }
    } catch (e) {
      console.error('Error fetching batches:', e);
    }
  };

  const fetchClasses = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.getClasses(user.school_id);
        if (error) throw error;
        setClasses(data || []);
      } else {
        setClasses([]);
      }
    } catch (e) {
      console.error('Error fetching classes:', e);
    }
  };

  const fetchSections = async () => {
    try {
      if (user.school_id) {
        const { data, error } = await supabaseService.getSections(user.school_id);
        if (error) throw error;
        setSections(data || []);
      } else {
        setSections([]);
      }
    } catch (e) {
      console.error('Error fetching sections:', e);
    }
  };

  const fetchFeePayments = async () => {
    try {
      setLoading(true);
      
      const { data: students, error: studentsError } = await supabaseService.supabase
        .from('students')
        .select('id, first_name, last_name, roll_no, father_name')
        .eq('school', form.school)
        .eq('batch_no', form.batch)
        .eq('class', form.class)
        .eq('section', form.section);
      
      if (studentsError) throw studentsError;
      
      const studentIds = students?.map(s => s.id) || [];
      
      await loadPreviousDues(studentIds);
      
      let query = supabaseService.supabase
        .from('fee_payments')
        .select('*')
        .eq('school_id', user.school_id)
        .order('created_at', { ascending: false });
      
      if (studentIds.length > 0) {
        query = query.in('student_id', studentIds);
      }
      
      if (form.fromDate) {
        query = query.gte('created_at', form.fromDate);
      }
      
      if (form.toDate) {
        query = query.lte('created_at', form.toDate + 'T23:59:59');
      }
      
      const { data: payments, error: paymentsError } = await query;
      
      if (paymentsError) throw paymentsError;
      
      const paymentsWithStudents = payments?.map(payment => {
        const student = students?.find(s => s.id === payment.student_id);
        console.log('Payment student_id:', payment.student_id, 'Found student:', student);
        return {
          ...payment,
          student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown',
          father_name: student?.father_name || 'N/A',
          roll_no: student?.roll_no || 'N/A'
        };
      }) || [];
      
      const groupedPayments = [];
      const timeGroups = {};
      
      paymentsWithStudents.forEach(payment => {
        const timeKey = new Date(payment.created_at).toISOString().slice(0, 19);
        if (!timeGroups[timeKey]) {
          timeGroups[timeKey] = {
            ...payment,
            fee_details: [{
              fee_head: payment.fee_head,
              month_name: payment.month_name,
              amount: parseFloat(payment.amount || 0)
            }],
            total_amount: parseFloat(payment.amount || 0)
          };
        } else {
          timeGroups[timeKey].fee_details.push({
            fee_head: payment.fee_head,
            month_name: payment.month_name,
            amount: parseFloat(payment.amount || 0)
          });
          timeGroups[timeKey].total_amount += parseFloat(payment.amount || 0);
        }
      });
      
      Object.values(timeGroups).forEach(group => {
        groupedPayments.push({
          ...group,
          fee_details: group.fee_details,
          amount: group.total_amount
        });
      });
      
      setFeePayments(groupedPayments);
    } catch (e) {
      console.error('Error fetching fee payments:', e);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return feePayments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
  };

  const printFeeReceipt = async (payment: any) => {
    try {
      // Get school details
      const { data: schoolData } = await supabaseService.supabase
        .from('schools')
        .select('*')
        .eq('school_name', form.school)
        .single();
      
      const school = schoolData || {};
      const totalAmount = parseFloat(payment.amount || 0);
      const fineAmount = parseFloat(payment.fine_amount || 0);
      const discount = parseFloat(payment.discount_amount || 0);
      const otherAmount = parseFloat(payment.other_amount || 0);
      
      // Group fees by fee head
      const feeGroups = {};
      payment.fee_details?.forEach(detail => {
        if (!feeGroups[detail.fee_head]) {
          feeGroups[detail.fee_head] = { months: [], totalAmount: 0 };
        }
        if (!feeGroups[detail.fee_head].months.includes(detail.month_name)) {
          feeGroups[detail.fee_head].months.push(detail.month_name);
        }
        feeGroups[detail.fee_head].totalAmount += detail.amount;
      });
      
      const receiptRows = Object.entries(feeGroups).map(([feeHead, data], index) => 
        `<tr><td>${index + 1}.</td><td>${data.months.join(', ')}</td><td>${feeHead}</td><td class="moveright">Rs. ${data.totalAmount}</td></tr>`
      ).join('');
      
      const receiptWindow = window.open('', '_blank', 'width=400,height=600,scrollbars=yes,resizable=yes');
      
      receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fee Receipt</title>
          <style>
            body{font-family:arial,helvetica,serif;margin:0;padding:0;background-color:#fff}
            .bill{height:132mm;width:90mm;border:1px solid #000;margin:2px;padding:5px;margin-top:8px;position:relative}
            .row:after{content:"";display:table;clear:both}
            .col-md-2,.col-md-10,.col-md-8,.col-md-10{float:left}
            .img1{width:auto;height:50px;margin:2px;margin-top:2px;margin-right:6px}
            .header{margin-top:3px}
            .col-md-10{width:80%}
            .name{font-size:16px;font-weight:bold;text-align:left;overflow:hidden}
            .address{font-size:12px;font-weight:bold}
            .email{font-size:10px;font-weight:normal;color:#666}
            .col-md-12{width:100%}
            .col-md-8{width:65%}
            .lineheight{line-height:18px}
            .nametop{margin-top:3px;margin-bottom:2px;line-height:18px;float:left}
            .bornone{border:none;padding:0;margin-left:4px}
            .tdspace{font-size:12px;font-weight:bold;padding-right:5px}
            .padspace{margin-right:4px}
            .roll,.ten{font-size:12px;font-weight:bold}
            .content{position:relative;min-height:280px}
            table,td,th,tr{border:1px solid #000000;border-collapse:collapse}
            .tab{width:100%}
            table{margin:auto}
            .table1{margin-bottom:32px}
            th{padding:1px;font-size:10px;background-color:#808080;color:#000000}
            td{padding:2px 4px 2px 4px;font-size:10px;height:12%}
            .moveright{text-align:right;font-size:10px;font-weight:bold}
            .cheque,.author{font-size:10px}
            .cite{font-size:10px;background-color:#808080;color:#000000;padding:5px;font-weight:bold;bottom:0px;width:332px;margin-bottom:2px}
            @media print{@page{size:A6}.bill{page-break-after:always}}
          </style>
        </head>
        <body onload="window.print()">
          <div class="bill">
            <div class="header">
              <div class="row">
                <div class="col-md-2">
                  <div class="logo">${school.logo_url ? `<img src="${school.logo_url}" class="img1">` : ''}</div>
                </div>
                <div class="col-md-12 lineheight">
                  <div class="name">${school.school_name || form.school}</div>
                  <div class="address">${school.address || 'School Address'}</div>
                  ${school.email ? `<div class="email">${school.email}</div>` : ''}
                </div>
                <div class="row nametop">
                  <div class="col-md-12">
                    <table class="bornone">
                      <tbody>
                        <tr class="bornone">
                          <td class="bornone tdspace" colspan="2" style="width:200px;">
                            <span class="padspace">PAN:</span><span>${school.pan_no || ''}</span>
                          </td>
                          <td class="bornone tdspace" colspan="1">
                            <span class="padspace">Date:</span><span>${new Date(payment.receipt_date || payment.created_at).toLocaleDateString()}</span>
                          </td>
                        </tr>
                        <tr class="bornone">
                          <td class="bornone tdspace" colspan="2" style="width:200px;">
                            <span class="padspace">Name:</span><span>${payment.student_name}</span>
                          </td>
                          <td class="bornone tdspace" colspan="1">
                            <span class="padspace">Class:</span><span>${form.class}</span>
                          </td>
                        </tr>
                        <tr class="bornone">
                          <td class="bornone tdspace" style="width:100px;">
                            <span class="padspace">Receipt:</span><span>${payment.receipt_no || payment.id}</span>
                          </td>
                          <td class="bornone tdspace" style="width:100px;text-align:center;">
                            <span class="padspace">Roll No:</span><span>${payment.roll_no}</span>
                          </td>
                          <td class="bornone tdspace">
                            <span class="padspace">Sec.:</span><span>${form.section}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="table1">
                <table class="tab">
                  <thead>
                    <tr>
                      <th>S/No</th>
                      <th>MONTH</th>
                      <th>PARTICULARS</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${receiptRows}
                    <tr>
                      <td colspan="3" class="moveright">Total Amount:</td>
                      <td class="moveright">Rs. ${totalAmount}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="moveright">Other Amount:</td>
                      <td class="moveright">Rs. ${otherAmount}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="moveright">Fine Amount:</td>
                      <td class="moveright">Rs. ${fineAmount}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="moveright">Net Payable Amount:</td>
                      <td class="moveright">Rs. ${totalAmount + otherAmount + fineAmount - discount}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="moveright">Paid Amount:</td>
                      <td class="moveright">Rs. ${totalAmount}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="moveright">Remaining Amount:</td>
                      <td class="moveright">Rs. ${parseFloat(payment.remaining_amount || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div id="fixedbottom">
              <div class="cash">
                <div class="row">
                  <div class="cheque col-md-8">Cash/Cheque/DD Collected by admin</div>
                  <div class="author col-md-4">Authorized Signatory</div>
                </div>
              </div>
              <div class="cite"><cite>Note: </cite></div>
            </div>
          </div>
        </body>
        </html>
      `);
      
      receiptWindow.document.close();
    } catch (error) {
      console.error('Error printing receipt:', error);
      alert('Error generating receipt');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 relative pb-4">
        <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
          Daily Fee Receipt Register
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
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b">
          <div className="flex items-center border-r h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">From:</div>
            <div className="flex-1 px-2">
              <input 
                type="date" 
                value={form.fromDate}
                onChange={(e) => setForm(p => ({ ...p, fromDate: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white"
              />
            </div>
          </div>
          <div className="flex items-center h-10 bg-white">
            <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">To:</div>
            <div className="flex-1 px-2">
              <input 
                type="date" 
                value={form.toDate}
                onChange={(e) => setForm(p => ({ ...p, toDate: e.target.value }))}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white"
              />
            </div>
          </div>
        </div>
        <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
          <BlueBtn onClick={fetchFeePayments} disabled={loading}>
            {loading ? 'SEARCHING...' : 'SEARCH'}
          </BlueBtn>
        </div>
      </div>

      {feePayments.length > 0 && (
        <div className="bg-white border border-gray-300 mb-6">
          <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Fee Payment Records</h3>
            <div className="text-sm font-bold text-gray-700">
              Total Records: {feePayments.length} | Total Amount: Rs. {getTotalAmount().toFixed(2)}
            </div>
          </div>
          <div className="overflow-x-auto" style={{maxWidth: '100vw'}}>
            <table className="border-collapse" style={{minWidth: '2000px'}}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Sl.No</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Student Name</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Father's Name</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Receipt No</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Date</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Manual Date</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Fee Month</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Fee Head</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Due Amt</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Dis. Amt</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Other Amt</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Fine Amt</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edu.Tax</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Prv Bal.</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Payable Amt</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Amt Paid</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Balance</th>
                  <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {feePayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{payment.student_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">{payment.father_name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{form.class}/{form.section}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">{payment.receipt_no || payment.id || 'N/A'}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-GB') : 
                       new Date(payment.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      {payment.manual_date ? new Date(payment.manual_date).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center" style={{minHeight: '60px', verticalAlign: 'top'}}>
                      <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.4'}}>
                        {payment.fee_details?.map((detail, idx) => (
                          <div key={idx}>{detail.month_name || 'N/A'}</div>
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs" style={{minHeight: '60px', verticalAlign: 'top'}}>
                      <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.4'}}>
                        {payment.fee_details?.map((detail, idx) => (
                          <div key={idx}>{detail.fee_head || 'N/A'}</div>
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right" style={{minHeight: '60px', verticalAlign: 'top'}}>
                      <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.4'}}>
                        {payment.fee_details?.map((detail, idx) => (
                          <div key={idx}>Rs. {detail.amount.toFixed(2)}</div>
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {parseFloat(payment.discount || payment.discount_amount || 0).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {parseFloat(payment.other_charges || payment.other_amount || 0).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {parseFloat(payment.fine || payment.fine_amount || 0).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {parseFloat(payment.tax || payment.education_tax || 0).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {parseFloat(previousDues[payment.student_id] || 0).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {(parseFloat(payment.amount || 0) + parseFloat(previousDues[payment.student_id] || 0)).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {parseFloat(payment.amount || 0).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-right">Rs. {((parseFloat(payment.amount || 0) + parseFloat(previousDues[payment.student_id] || 0)) - parseFloat(payment.amount || 0)).toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                      <button 
                        onClick={() => window.location.href = `#/variable-fees/view_fee_details?studentId=${payment.student_id}&receiptNo=${payment.receipt_no || payment.id}`}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer underline text-xs"
                      >
                        View Fee Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {feePayments.length === 0 && !loading && (
        <div className="bg-white border border-gray-300 p-8 text-center">
          <p className="text-gray-500">No fee payment records found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DailyFeeReceiptRegister;