import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Wallet, 
  Calendar, 
  Star, 
  History, 
  AlertCircle, 
  X, 
  Eye, 
  CreditCard, 
  FileText, 
  Building2, 
  ArrowLeft,
  Search as SearchIcon,
  Receipt,
  Edit,
  Trash2,
  CalendarDays,
  Loader2,
  RefreshCw,
  Database,
  XCircle,
  Plus,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react';
import { User } from '../types';
import { callBackend } from '../services/api';
import { useLocation } from 'react-router-dom';

// UI Components for consistent aesthetic
const SubHeader = ({ title, onSync }: { title: string, onSync?: () => void }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl text-[#2980b9] font-medium uppercase tracking-tight">{title}</h2>
    {onSync && (
      <button 
        onClick={onSync}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold transition-all no-print"
      >
        <Database size={14} /> Sync Sheets
      </button>
    )}
  </div>
);

const SectionBox = ({ children, isEditing }: { children: React.ReactNode; isEditing?: boolean }) => (
  <div className={`border-2 ${isEditing ? 'border-orange-500 shadow-orange-100 shadow-lg scale-[1.01]' : 'border-gray-200 shadow-sm'} mb-6 bg-white overflow-hidden transition-all duration-300`}>
    {isEditing && (
      <div className="bg-orange-500 text-white text-[10px] font-black uppercase px-4 py-1.5 flex items-center gap-2 tracking-widest">
        <Edit size={10} /> Now Updating Record Information
      </div>
    )}
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

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

const FeeTable = ({ headers, data, renderRow }: any) => (
  <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-6">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-white border-b">
            {headers.map((h: string) => <th key={h} className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr><td colSpan={headers.length} className="text-center py-10 lg:py-20 text-gray-400 font-medium text-sm">No records found.</td></tr>
          ) : data.map((item: any, idx: number) => renderRow(item, idx))}
        </tbody>
      </table>
    </div>
  </div>
);

interface FinancialYear {
  id: string;
  financialYear: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
}

interface FeeBook {
  id: string;
  college: string;
  financialYear: string;
  bookNo: string;
  orderNo: string;
  bookNoFrom: string;
  bookNoTo: string;
  status: 'Active' | 'Inactive';
}

interface FeeHead {
  id: string;
  feeHead: string;
  shortName: string;
  type: string;
}

interface FeeCategory {
  id: string;
  feeCategory: string;
}

interface MonthMaster {
  id: string;
  feeMonth: string;
  feeStructure: string;
  feeSubmitDate: string;
  fine: number;
}

interface EduTax {
  id: string;
  taxName: string;
  percentage: number;
  isActive: boolean;
}

const Fees: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState(() => {
    const path = location.pathname;
    if (path.includes('fee_book')) return 'fee_book';
    if (path.includes('fee_head')) return 'fee_head';
    if (path.includes('fee_category')) return 'fee_category';
    if (path.includes('edu_tax')) return 'edu_tax';
    if (path.includes('fin_year')) return 'fin_year';
    if (path.includes('month_master')) return 'month_master';
    if (path.includes('fee_month')) return 'fee_month';
    if (path.includes('fee_structure')) return 'fee_structure';
    return 'submit';
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  // Financial Year State
  const [finYearsList, setFinYearsList] = useState<FinancialYear[]>([]);
  const [editingFinYearId, setEditingFinYearId] = useState<string | null>(null);
  const [finYearForm, setFinYearForm] = useState({
    financialYear: '',
    name: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  });

  // Fee Book State
  const [feeBooksList, setFeeBooksList] = useState<FeeBook[]>([]);
  const [editingFeeBookId, setEditingFeeBookId] = useState<string | null>(null);
  const [feeBookForm, setFeeBookForm] = useState({
    college: '',
    financialYear: '',
    bookNo: '',
    orderNo: '',
    bookNoFrom: '',
    bookNoTo: '',
    status: 'Active'
  });

  // Fee Head State
  const [feeHeadsList, setFeeHeadsList] = useState<FeeHead[]>([]);
  const [editingFeeHeadId, setEditingFeeHeadId] = useState<string | null>(null);
  const [feeHeadForm, setFeeHeadForm] = useState({
    feeHead: '',
    shortName: '',
    type: '' // Will store 'variable', 'general', or 'occasionally'
  });

  // Fee Category State
  const [feeCategoriesList, setFeeCategoriesList] = useState<FeeCategory[]>([]);
  const [editingFeeCategoryId, setEditingFeeCategoryId] = useState<string | null>(null);
  const [feeCategoryForm, setFeeCategoryForm] = useState({
    feeCategory: ''
  });

  // Month Master State
  const [monthMasterList, setMonthMasterList] = useState<MonthMaster[]>([]);
  const [editingMonthMasterId, setEditingMonthMasterId] = useState<string | null>(null);
  const [monthMasterForm, setMonthMasterForm] = useState({
    feeMonth: '',
    feeStructure: '',
    feeSubmitDate: '',
    fine: 0
  });

  // Education Tax State
  const [eduTaxList, setEduTaxList] = useState<EduTax[]>([]);
  const [editingEduTaxId, setEditingEduTaxId] = useState<string | null>(null);
  const [eduTaxForm, setEduTaxForm] = useState({
    taxName: '',
    percentage: 0,
    isActive: true
  });

  // Fee Month State
  const [feeMonthsList, setFeeMonthsList] = useState<any[]>([]);
  const [editingFeeMonthId, setEditingFeeMonthId] = useState<string | null>(null);
  const [feeMonthForm, setFeeMonthForm] = useState({
    monthName: '',
    monthOrder: ''
  });
  const [feeMonthSearch, setFeeMonthSearch] = useState('');

  // Fee Structure State
  const [feeStructureForm, setFeeStructureForm] = useState({
    school: 'NORMAL MAX TEST ADMIN',
    branch: 'Normal Max Test Admin',
    batch: '2080',
    class: '',
    monthName: ''
  });
  const [feeStructureDetails, setFeeStructureDetails] = useState<any[]>([]);
  const [feeHeadsData, setFeeHeadsData] = useState<any[]>([]);
  const [totals, setTotals] = useState({ general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 });

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('fin_year')) setActiveModule('fin_year');
    else if (path.includes('fee_book')) setActiveModule('fee_book');
    else if (path.includes('fee_head')) setActiveModule('fee_head');
    else if (path.includes('fee_category')) setActiveModule('fee_category');
    else if (path.includes('edu_tax')) setActiveModule('edu_tax');
    else if (path.includes('month_master')) setActiveModule('month_master');
    else if (path.includes('fee_month')) setActiveModule('fee_month');
    else if (path.includes('fee_structure')) setActiveModule('fee_structure');
    else if (path.includes('due_student_fee')) setActiveModule('due_student_fee');
    else if (path.includes('student_fee_submit')) setActiveModule('student_fee_submit');
    else if (path.includes('view_student_fee_details')) setActiveModule('view_student_fee_details');
    else if (path.includes('daily_fee_receipt_register')) setActiveModule('daily_fee_receipt_register');
    else setActiveModule('submit');
  }, [location.pathname]);

  useEffect(() => {
    if (activeModule === 'fin_year') fetchFinYears();
    else if (activeModule === 'fee_book') { fetchFeeBooks(); fetchFinYears(); }
    else if (activeModule === 'fee_head') fetchFeeHeads();
    else if (activeModule === 'fee_category') fetchFeeCategories();
    else if (activeModule === 'edu_tax') fetchEduTax();
    else if (activeModule === 'month_master') fetchMonthMaster();
    else if (activeModule === 'fee_month') fetchFeeMonths();
    else if (activeModule === 'fee_structure') { fetchFeeStructureDetails(); initializeFeeHeads(); fetchFinYears(); }
    else if (activeModule === 'due_student_fee') { fetchFinYears(); fetchFeeHeads(); }
    else if (activeModule === 'student_fee_submit') { fetchFinYears(); fetchFeeHeads(); }
    else if (activeModule === 'view_student_fee_details') { fetchFinYears(); fetchFeeHeads(); }
    else if (activeModule === 'daily_fee_receipt_register') { fetchFinYears(); fetchFeeHeads(); }
    else if (activeModule === 'submit') fetchStudents();
  }, [activeModule]);

  const calculateTotals = () => {
    const general = feeHeadsData.reduce((sum, item) => {
      return item.applyDDCharges === 'Must' ? sum + (parseFloat(item.general) || 0) : sum;
    }, 0);
    const twentyFivePercent = feeHeadsData.reduce((sum, item) => {
      return item.applyDDCharges === 'Must' ? sum + (parseFloat(item.twentyFivePercent) || 0) : sum;
    }, 0);
    const fiftyPercent = feeHeadsData.reduce((sum, item) => {
      return item.applyDDCharges === 'Must' ? sum + (parseFloat(item.fiftyPercent) || 0) : sum;
    }, 0);
    const outOfThree = feeHeadsData.reduce((sum, item) => {
      return item.applyDDCharges === 'Must' ? sum + (parseFloat(item.outOfThree) || 0) : sum;
    }, 0);
    setTotals({ general, twentyFivePercent, fiftyPercent, outOfThree });
  };

  const updateFeeHead = (index: number, field: string, value: any) => {
    const updated = [...feeHeadsData];
    updated[index] = { ...updated[index], [field]: value };
    setFeeHeadsData(updated);
  };

  useEffect(() => {
    calculateTotals();
  }, [feeHeadsData]);

  const saveFeeStructure = async () => {
    if (!feeStructureForm.school || !feeStructureForm.class || !feeStructureForm.monthName) {
      alert('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      for (const feeHead of feeHeadsData) {
        const payload = {
          id: Date.now().toString() + Math.random().toString(),
          school: feeStructureForm.school,
          branch: feeStructureForm.branch,
          batch: feeStructureForm.batch,
          class: feeStructureForm.class,
          monthName: feeStructureForm.monthName,
          feeHeadId: feeHead.id,
          feeHead: feeHead.name,
          applyDDCharges: feeHead.applyDDCharges || 'None',
          general: feeHead.general || 0,
          twentyFivePercent: feeHead.twentyFivePercent || 0,
          fiftyPercent: feeHead.fiftyPercent || 0,
          outOfThree: feeHead.outOfThree || 0
        };
        await callBackend('SAVE_DATA', { sheetName: 'fee_structure_details', data: payload });
      }
      alert('Fee Structure saved successfully');
    } catch (e: any) {
      alert(`Save failed: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetFeeStructure = () => {
    initializeFeeHeads();
    setFeeStructureForm({
      school: 'NORMAL MAX TEST ADMIN',
      branch: 'Normal Max Test Admin',
      batch: '2080',
      class: '',
      monthName: ''
    });
  };
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const sData = await callBackend('GET_DATA', { sheetName: 'students' });
      setStudents(sData || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFinYears = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'financial_years' });
      setFinYearsList(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFeeBooks = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'fee_books' });
      setFeeBooksList(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFeeHeads = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'fee_heads' });
      setFeeHeadsList(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFeeCategories = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'fee_categories' });
      setFeeCategoriesList(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchEduTax = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'edu_tax' });
      setEduTaxList(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchMonthMaster = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'month_master' });
      setMonthMasterList(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchFeeStructureDetails = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'fee_structure_details' });
      setFeeStructureDetails(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const initializeFeeHeads = async () => {
    const feeHeads = [
      { id: '4190', name: 'Monthly Fee', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4191', name: 'Exam Fee', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4192', name: 'House Dress', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4193', name: 'Diary', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4194', name: 'Tie', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4195', name: 'Belt', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4196', name: 'App & Id Card', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4197', name: 'Transportation Fee', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4198', name: 'Annual Fee', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4199', name: 'Admission Fee', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4200', name: 'Extra Class Fee', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '4201', name: 'Educational Tour', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '5533', name: 'Picnic Fee', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '5985', name: 'Breakfast', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 },
      { id: '6017', name: 'E learning', applyDDCharges: 'None', general: 0, twentyFivePercent: 0, fiftyPercent: 0, outOfThree: 0 }
    ];
    setFeeHeadsData(feeHeads);
  };

  const fetchFeeMonths = async () => {
    setLoading(true);
    try {
      const data = await callBackend('GET_DATA', { sheetName: 'month_master' });
      console.log('Fee months data from backend:', data);
      setFeeMonthsList(data || []);
    } catch (e) { 
      console.error('Error fetching fee months:', e);
      setFeeMonthsList([]);
    }
    finally { setLoading(false); }
  };

  // --- FINANCIAL YEAR ACTIONS ---
  const handleEditFinYear = (fy: FinancialYear, compositeId: string) => {
    setEditingFinYearId(compositeId);
    setFinYearForm({
      financialYear: String(fy.financialYear || ''),
      name: String(fy.name || ''),
      startDate: fy.startDate ? fy.startDate.split('T')[0] : '',
      endDate: fy.endDate ? fy.endDate.split('T')[0] : '',
      status: fy.status || 'Active'
    });
    setShowEditModal(true);
  };

  const handleDeleteFinYear = async (compositeId: string) => {
    console.log('Deleting Financial Year with composite ID:', compositeId);
    if (!window.confirm(`Are you sure you want to delete this financial year?`)) return;
    setLoading(true);
    try {
      const result = await callBackend('DELETE_DATA', { sheetName: 'financial_years', id: compositeId });
      console.log('Delete result:', result);
      alert('Financial Year deleted successfully');
      await fetchFinYears();
    } catch (e: any) {
      console.error('Delete error:', e);
      alert(`Delete failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFinYear = async () => {
    if (!finYearForm.financialYear.trim()) { alert("Enter Financial Year"); return; }
    console.log('Saving Financial Year:', finYearForm);
    setSubmitting(true);
    try {
      // Generate unique ID when adding new record
      let payload = { ...finYearForm };
      if (!editingFinYearId) {
        // Generate unique ID: timestamp + random number
        const uniqueId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        payload.id = uniqueId;
        console.log('Generated unique ID:', uniqueId);
      }
      
      console.log('Payload to send:', payload);
      
      if (editingFinYearId) {
        console.log('Updating with ID:', editingFinYearId);
        await callBackend('UPDATE_DATA', { sheetName: 'financial_years', id: editingFinYearId, data: payload });
        alert("Financial Year Updated Successfully");
        setShowEditModal(false);
      } else {
        console.log('Creating new record with generated ID');
        const result = await callBackend('SAVE_DATA', { sheetName: 'financial_years', data: payload });
        console.log('Save result:', result);
        alert("New Financial Year Added");
      }
      setEditingFinYearId(null);
      setFinYearForm({ financialYear: '', name: '', startDate: '', endDate: '', status: 'Active' });
      await fetchFinYears();
    } catch (e: any) { 
      console.error('Save error:', e);
      alert(`Save failed: ${e.message}`); 
    }
    finally { setSubmitting(false); }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Fee Management</h1>
            <p className="text-sm lg:text-base text-gray-500">Manage financial years, fee books, categories and student billing</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-3 lg:px-4 py-2 lg:py-2.5 bg-white border border-gray-200 rounded-xl text-xs lg:text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm flex items-center justify-center gap-2">
              <Database size={16} className="lg:w-[18px] lg:h-[18px]" /> Sync Data
            </button>
            <button className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
              <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Quick Add
            </button>
          </div>
        </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
        {activeModule === 'fin_year' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Financial Year Information
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <SectionBox>
              <div className="grid grid-cols-1 lg:grid-cols-4 border-b">
                <div className="flex flex-col lg:flex-row lg:items-center border-b lg:border-b-0 lg:border-r h-auto lg:h-10 bg-white py-2 lg:py-0">
                  <div className="w-full lg:w-32 bg-gray-50 h-8 lg:h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 lg:border-r mb-1 lg:mb-0">Fin Year:</div>
                  <div className="flex-1 px-0 lg:px-2"><Input value={finYearForm.financialYear} onChange={(e) => setFinYearForm(p => ({ ...p, financialYear: e.target.value }))} placeholder="Ex: 2080/81" /></div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center border-b lg:border-b-0 lg:border-r h-auto lg:h-10 bg-white py-2 lg:py-0">
                  <div className="w-full lg:w-24 bg-gray-50 h-8 lg:h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 lg:border-r mb-1 lg:mb-0">Name:</div>
                  <div className="flex-1 px-0 lg:px-2"><Input value={finYearForm.name} onChange={(e) => setFinYearForm(p => ({ ...p, name: e.target.value }))} placeholder="Current FY" /></div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center border-b lg:border-b-0 lg:border-r h-auto lg:h-10 bg-white py-2 lg:py-0">
                  <div className="w-full lg:w-32 bg-gray-50 h-8 lg:h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 lg:border-r mb-1 lg:mb-0">From:</div>
                  <div className="flex-1 px-0 lg:px-2"><Input type="date" value={finYearForm.startDate} onChange={(e) => setFinYearForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center h-auto lg:h-10 bg-white py-2 lg:py-0">
                  <div className="w-full lg:w-32 bg-gray-50 h-8 lg:h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 lg:border-r mb-1 lg:mb-0">To:</div>
                  <div className="flex-1 px-0 lg:px-2"><Input type="date" value={finYearForm.endDate} onChange={(e) => setFinYearForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                </div>
              </div>
              <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
                <BlueBtn onClick={handleSaveFinYear} disabled={submitting}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : (editingFinYearId ? 'UPDATE' : 'ADD')}
                </BlueBtn>
                <BlueBtn onClick={() => {
                  setFinYearForm({financialYear:'', name:'', startDate:'', endDate:'', status:'Active'});
                  setEditingFinYearId(null);
                }} color="bg-gray-400">CANCEL</BlueBtn>
              </div>
            </SectionBox>
            
            <FeeTable 
              headers={['S.no', 'ID', 'Financial Year', 'Name', 'From', 'To', 'Actions', 'Status']}
              data={finYearsList}
              renderRow={(row: FinancialYear, i: number) => {
                const sno = i + 1; // S.no starts from 1
                return (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5 text-center text-gray-500 font-bold">{sno}</td>
                    <td className="px-8 py-5 text-xs text-gray-600 font-mono">{row.id}</td>
                    <td className="px-8 py-5 font-black text-gray-900">{row.financialYear}</td>
                    <td className="px-8 py-5 text-gray-600">{row.name}</td>
                    <td className="px-8 py-5 text-gray-500">{row.startDate?.split('T')[0] || '-'}</td>
                    <td className="px-8 py-5 text-gray-500">{row.endDate?.split('T')[0] || '-'}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditFinYear(row, row.id)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteFinYear(row.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                );
              }}
            />
          </div>
        )}

        {activeModule === 'fee_book' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Fee Book Details</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
            </div>
            <SectionBox>
              <div className="grid grid-cols-1 md:grid-cols-3 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">College:</div>
                  <div className="flex-1 px-2"><Input value={feeBookForm.college} onChange={(e) => setFeeBookForm(p => ({ ...p, college: e.target.value }))} placeholder="Ex: Everest Main" /></div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">FY:</div>
                  <div className="flex-1 px-2">
                    <Select value={feeBookForm.financialYear} onChange={(e) => setFeeBookForm(p => ({ ...p, financialYear: e.target.value }))}>
                      <option value="">Select Financial Year</option>
                      {finYearsList.map(fy => <option key={fy.id} value={fy.financialYear}>{fy.financialYear}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Book No:</div>
                  <div className="flex-1 px-2"><Input value={feeBookForm.bookNo} onChange={(e) => setFeeBookForm(p => ({ ...p, bookNo: e.target.value }))} placeholder="FB-001" /></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Order No:</div>
                  <div className="flex-1 px-2"><Input value={feeBookForm.orderNo} onChange={(e) => setFeeBookForm(p => ({ ...p, orderNo: e.target.value }))} placeholder="ORD-001" /></div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Book From:</div>
                  <div className="flex-1 px-2"><Input value={feeBookForm.bookNoFrom} onChange={(e) => setFeeBookForm(p => ({ ...p, bookNoFrom: e.target.value }))} placeholder="1001" /></div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Book To:</div>
                  <div className="flex-1 px-2"><Input value={feeBookForm.bookNoTo} onChange={(e) => setFeeBookForm(p => ({ ...p, bookNoTo: e.target.value }))} placeholder="2000" /></div>
                </div>
              </div>
              {editingFeeBookId && (
                <div className="grid grid-cols-1 border-b">
                  <div className="flex items-center h-10 bg-white">
                    <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Status:</div>
                    <div className="flex-1 px-2">
                      <Select value={feeBookForm.status} onChange={(e) => setFeeBookForm(p => ({ ...p, status: e.target.value }))}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-3.5 flex justify-center gap-4 bg-white">
                <BlueBtn onClick={async () => {
                  if (!feeBookForm.college.trim()) { alert('Enter College Name'); return; }
                  setSubmitting(true);
                  try {
                    let payload = { ...feeBookForm };
                    if (!editingFeeBookId) {
                      payload.id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
                    }
                    if (editingFeeBookId) {
                      await callBackend('UPDATE_DATA', { sheetName: 'fee_books', id: editingFeeBookId, data: payload });
                      alert('Fee Book Updated Successfully');
                      setEditingFeeBookId(null);
                    } else {
                      await callBackend('SAVE_DATA', { sheetName: 'fee_books', data: payload });
                      alert('New Fee Book Added');
                    }
                    setFeeBookForm({ college: '', financialYear: '', bookNo: '', orderNo: '', bookNoFrom: '', bookNoTo: '', status: 'Active' });
                    await fetchFeeBooks();
                  } catch (e: any) { alert(e.message); }
                  finally { setSubmitting(false); }
                }} disabled={submitting}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : (editingFeeBookId ? 'UPDATE' : 'ADD')}
                </BlueBtn>
                <BlueBtn onClick={() => {
                  setFeeBookForm({ college: '', financialYear: '', bookNo: '', orderNo: '', bookNoFrom: '', bookNoTo: '', status: 'Active' });
                  setEditingFeeBookId(null);
                }} color="bg-gray-400">CANCEL</BlueBtn>
              </div>
            </SectionBox>
            <FeeTable 
              headers={['College', 'Financial Year', 'Book No', 'Order No', 'Book No From', 'Book No To', 'Actions', 'Status']}
              data={feeBooksList}
              renderRow={(row: FeeBook) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 font-medium text-gray-700">{row.college}</td>
                  <td className="px-8 py-5 font-bold text-gray-900">{row.financialYear}</td>
                  <td className="px-8 py-5 text-gray-600">{row.bookNo}</td>
                  <td className="px-8 py-5 text-gray-600">{row.orderNo}</td>
                  <td className="px-8 py-5 text-gray-600">{row.bookNoFrom}</td>
                  <td className="px-8 py-5 text-gray-600">{row.bookNoTo}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => {
                        setEditingFeeBookId(row.id);
                        setFeeBookForm({
                          college: row.college || '',
                          financialYear: row.financialYear || '',
                          bookNo: row.bookNo || '',
                          orderNo: row.orderNo || '',
                          bookNoFrom: row.bookNoFrom || '',
                          bookNoTo: row.bookNoTo || '',
                          status: row.status || 'Active'
                        });
                      }} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this fee book?')) return;
                        setLoading(true);
                        try {
                          await callBackend('DELETE_DATA', { sheetName: 'fee_books', id: row.id });
                          alert('Fee Book deleted successfully');
                          await fetchFeeBooks();
                        } catch (e: any) {
                          alert(`Delete failed: ${e.message}`);
                        } finally {
                          setLoading(false);
                        }
                      }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {row.status || 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              )}
            />
          </div>
        )}

        {activeModule === 'fee_head' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Fee Head Management</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
            </div>
            <SectionBox>
              <div className="grid grid-cols-1 md:grid-cols-2 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Fee Head:</div>
                  <div className="flex-1 px-2"><Input value={feeHeadForm.feeHead} onChange={(e) => setFeeHeadForm(p => ({ ...p, feeHead: e.target.value }))} placeholder="Ex: Tuition Fee" /></div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Short Name:</div>
                  <div className="flex-1 px-2"><Input value={feeHeadForm.shortName} onChange={(e) => setFeeHeadForm(p => ({ ...p, shortName: e.target.value }))} placeholder="TF" /></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Variable:</div>
                  <div className="flex-1 px-2 flex items-center">
                    <input type="radio" name="feeType" checked={feeHeadForm.type === 'variable'} onChange={() => setFeeHeadForm(p => ({ ...p, type: 'variable' }))} className="mr-2" />
                    <span className="text-xs">Select</span>
                  </div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">General:</div>
                  <div className="flex-1 px-2 flex items-center">
                    <input type="radio" name="feeType" checked={feeHeadForm.type === 'general'} onChange={() => setFeeHeadForm(p => ({ ...p, type: 'general' }))} className="mr-2" />
                    <span className="text-xs">Select</span>
                  </div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Occasionally:</div>
                  <div className="flex-1 px-2 flex items-center">
                    <input type="radio" name="feeType" checked={feeHeadForm.type === 'occasionally'} onChange={() => setFeeHeadForm(p => ({ ...p, type: 'occasionally' }))} className="mr-2" />
                    <span className="text-xs">Select</span>
                  </div>
                </div>
              </div>
              <div className="p-3.5 flex justify-center gap-4 bg-white">
                <BlueBtn onClick={async () => {
                  if (!feeHeadForm.feeHead.trim()) { alert('Enter Fee Head'); return; }
                  if (!feeHeadForm.type) { alert('Select Type (Variable, General, or Occasionally)'); return; }
                  setSubmitting(true);
                  try {
                    let payload = { ...feeHeadForm };
                    if (!editingFeeHeadId) {
                      payload.id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
                    }
                    if (editingFeeHeadId) {
                      await callBackend('UPDATE_DATA', { sheetName: 'fee_heads', id: editingFeeHeadId, data: payload });
                      alert('Fee Head Updated Successfully');
                      setEditingFeeHeadId(null);
                    } else {
                      await callBackend('SAVE_DATA', { sheetName: 'fee_heads', data: payload });
                      alert('New Fee Head Added');
                    }
                    setFeeHeadForm({feeHead:'', shortName:'', type:''});
                    await fetchFeeHeads();
                  } catch (e: any) { alert(e.message); }
                  finally { setSubmitting(false); }
                }} disabled={submitting}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : (editingFeeHeadId ? 'UPDATE' : 'ADD')}
                </BlueBtn>
                <BlueBtn onClick={() => {
                  setFeeHeadForm({feeHead:'', shortName:'', type:''});
                  setEditingFeeHeadId(null);
                }} color="bg-gray-400">CANCEL</BlueBtn>
              </div>
            </SectionBox>
            <FeeTable 
              headers={['SL.No', 'Fee Head', 'ShortName', 'Type', 'Edit', 'Delete']}
              data={feeHeadsList}
              renderRow={(row: FeeHead, i: number) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 text-center text-gray-500 font-bold">{i+1}</td>
                  <td className="px-8 py-5 font-black text-gray-900">{row.feeHead}</td>
                  <td className="px-8 py-5 text-gray-600">{row.shortName}</td>
                  <td className="px-8 py-5 text-gray-500 capitalize">{row.type}</td>
                  <td className="px-8 py-5">
                    <button onClick={() => {
                      setEditingFeeHeadId(row.id);
                      setFeeHeadForm({
                        feeHead: row.feeHead || '',
                        shortName: row.shortName || '',
                        type: row.type || ''
                      });
                    }} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                      <Edit size={18} />
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <button onClick={async () => {
                      if (!window.confirm('Are you sure you want to delete this fee head?')) return;
                      setLoading(true);
                      try {
                        await callBackend('DELETE_DATA', { sheetName: 'fee_heads', id: row.id });
                        alert('Fee Head deleted successfully');
                        await fetchFeeHeads();
                      } catch (e: any) {
                        alert(`Delete failed: ${e.message}`);
                      } finally {
                        setLoading(false);
                      }
                    }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )}
            />
          </div>
        )}

        {activeModule === 'fee_category' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Fee Category Management</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
            </div>
            <SectionBox>
              <div className="grid grid-cols-1 border-b">
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Category:</div>
                  <div className="flex-1 px-2"><Input value={feeCategoryForm.feeCategory} onChange={(e) => setFeeCategoryForm(p => ({ ...p, feeCategory: e.target.value }))} placeholder="Ex: Academic Fee" /></div>
                </div>
              </div>
              <div className="p-3.5 flex justify-center gap-4 bg-white">
                <BlueBtn onClick={() => alert('Save Fee Category')} disabled={submitting}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : 'ADD'}
                </BlueBtn>
                <BlueBtn onClick={() => setFeeCategoryForm({feeCategory:''})} color="bg-gray-400">CANCEL</BlueBtn>
              </div>
            </SectionBox>
            <FeeTable 
              headers={['S.no', 'Fee Category', 'Actions']}
              data={feeCategoriesList}
              renderRow={(row: FeeCategory, i: number) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 text-center text-gray-500 font-bold">{i+1}</td>
                  <td className="px-8 py-5 font-black text-gray-900">{row.feeCategory}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>
        )}

        {activeModule === 'edu_tax' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Education Tax Management</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
            </div>
            <SectionBox>
              <div className="grid grid-cols-1 md:grid-cols-3 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Tax Name:</div>
                  <div className="flex-1 px-2"><Input value={eduTaxForm.taxName} onChange={(e) => setEduTaxForm(p => ({ ...p, taxName: e.target.value }))} placeholder="Ex: Education Service Tax" /></div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Percentage:</div>
                  <div className="flex-1 px-2"><Input type="number" step="0.01" value={eduTaxForm.percentage} onChange={(e) => setEduTaxForm(p => ({ ...p, percentage: parseFloat(e.target.value) || 0 }))} placeholder="13.00" /></div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Status:</div>
                  <div className="flex-1 px-2 flex items-center">
                    <input type="checkbox" checked={eduTaxForm.isActive} onChange={(e) => setEduTaxForm(p => ({ ...p, isActive: e.target.checked }))} className="mr-2" />
                    <span className="text-xs">Active</span>
                  </div>
                </div>
              </div>
              <div className="p-3.5 flex justify-center gap-4 bg-white">
                <BlueBtn onClick={() => alert('Save Education Tax')} disabled={submitting}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : 'ADD'}
                </BlueBtn>
                <BlueBtn onClick={() => setEduTaxForm({taxName:'', percentage:0, isActive:true})} color="bg-gray-400">CANCEL</BlueBtn>
              </div>
            </SectionBox>
            <FeeTable 
              headers={['S.no', 'Tax Name', 'Percentage (%)', 'Status', 'Actions']}
              data={eduTaxList}
              renderRow={(row: EduTax, i: number) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 text-center text-gray-500 font-bold">{i+1}</td>
                  <td className="px-8 py-5 font-black text-gray-900">{row.taxName}</td>
                  <td className="px-8 py-5 text-gray-600">{row.percentage}%</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {row.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 bg-orange-600 text-white">
                <h3 className="text-xl font-bold">Update Financial Year</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Financial Year</label>
                    <Input value={finYearForm.financialYear} onChange={(e) => setFinYearForm(p => ({ ...p, financialYear: e.target.value }))} placeholder="Ex: 2080/81" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                    <Input value={finYearForm.name} onChange={(e) => setFinYearForm(p => ({ ...p, name: e.target.value }))} placeholder="Current FY" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                    <Input type="date" value={finYearForm.startDate} onChange={(e) => setFinYearForm(p => ({ ...p, startDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                    <Input type="date" value={finYearForm.endDate} onChange={(e) => setFinYearForm(p => ({ ...p, endDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                    <select value={finYearForm.status} onChange={(e) => setFinYearForm(p => ({ ...p, status: e.target.value }))} className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-4">
                <button onClick={() => {setShowEditModal(false); setEditingFinYearId(null); setFinYearForm({ financialYear: '', name: '', startDate: '', endDate: '', status: 'Active' });}} className="px-6 py-2 bg-gray-400 text-white rounded-xl font-bold">
                  Cancel
                </button>
                <button onClick={handleSaveFinYear} className="px-6 py-2 bg-orange-600 text-white rounded-xl font-bold" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'month_master' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Month Master Management</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
            </div>
            <SectionBox>
              <div className="grid grid-cols-1 md:grid-cols-4 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Fee Month:</div>
                  <div className="flex-1 px-2">
                    <Select value={monthMasterForm.feeMonth} onChange={(e) => setMonthMasterForm(p => ({ ...p, feeMonth: e.target.value }))}>
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Fee Structure:</div>
                  <div className="flex-1 px-2"><Input value={monthMasterForm.feeStructure} onChange={(e) => setMonthMasterForm(p => ({ ...p, feeStructure: e.target.value }))} placeholder="Monthly/Quarterly" /></div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Submit Date:</div>
                  <div className="flex-1 px-2"><Input type="date" value={monthMasterForm.feeSubmitDate} onChange={(e) => setMonthMasterForm(p => ({ ...p, feeSubmitDate: e.target.value }))} /></div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Fine:</div>
                  <div className="flex-1 px-2"><Input type="number" value={monthMasterForm.fine} onChange={(e) => setMonthMasterForm(p => ({ ...p, fine: parseFloat(e.target.value) || 0 }))} placeholder="0" /></div>
                </div>
              </div>
              <div className="p-3.5 flex justify-center gap-4 bg-white">
                <BlueBtn onClick={async () => {
                  if (!monthMasterForm.feeMonth) { alert('Select Fee Month'); return; }
                  setSubmitting(true);
                  try {
                    let payload = { ...monthMasterForm };
                    if (!editingMonthMasterId) {
                      payload.id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
                    }
                    if (editingMonthMasterId) {
                      await callBackend('UPDATE_DATA', { sheetName: 'month_master', id: editingMonthMasterId, data: payload });
                      alert('Month Master Updated Successfully');
                      setEditingMonthMasterId(null);
                    } else {
                      await callBackend('SAVE_DATA', { sheetName: 'month_master', data: payload });
                      alert('New Month Master Added');
                    }
                    setMonthMasterForm({ feeMonth: '', feeStructure: '', feeSubmitDate: '', fine: 0 });
                    await fetchMonthMaster();
                  } catch (e: any) { alert(e.message); }
                  finally { setSubmitting(false); }
                }} disabled={submitting}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : (editingMonthMasterId ? 'UPDATE' : 'ADD')}
                </BlueBtn>
                <BlueBtn onClick={() => {
                  setMonthMasterForm({ feeMonth: '', feeStructure: '', feeSubmitDate: '', fine: 0 });
                  setEditingMonthMasterId(null);
                }} color="bg-gray-400">CANCEL</BlueBtn>
              </div>
            </SectionBox>
            <FeeTable 
              headers={['SL.No', 'Fee Month', 'Fee Structure', 'Submit Date', 'Fine', 'Edit', 'Delete']}
              data={monthMasterList}
              renderRow={(row: MonthMaster, i: number) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 text-center text-gray-500 font-bold">{i+1}</td>
                  <td className="px-8 py-5 font-black text-gray-900">{row.feeMonth}</td>
                  <td className="px-8 py-5 text-gray-600">{row.feeStructure}</td>
                  <td className="px-8 py-5 text-gray-500">{row.feeSubmitDate}</td>
                  <td className="px-8 py-5 text-gray-500">{row.fine}</td>
                  <td className="px-8 py-5">
                    <button onClick={() => {
                      setEditingMonthMasterId(row.id);
                      setMonthMasterForm({
                        feeMonth: row.feeMonth || '',
                        feeStructure: row.feeStructure || '',
                        feeSubmitDate: row.feeSubmitDate || '',
                        fine: row.fine || 0
                      });
                    }} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                      <Edit size={18} />
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <button onClick={async () => {
                      if (!window.confirm('Are you sure you want to delete this month master?')) return;
                      setLoading(true);
                      try {
                        await callBackend('DELETE_DATA', { sheetName: 'month_master', id: row.id });
                        alert('Month Master deleted successfully');
                        await fetchMonthMaster();
                      } catch (e: any) {
                        alert(`Delete failed: ${e.message}`);
                      } finally {
                        setLoading(false);
                      }
                    }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )}
            />
          </div>
        )}

        {activeModule === 'fee_month' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Fees Month Search</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
              <button 
                onClick={async () => {
                  console.log('Manual sync triggered');
                  await fetchFeeMonths();
                }}
                className="absolute right-12 top-0 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Sync Data
              </button>
              <button 
                onClick={async () => {
                  console.log('Manual sync triggered');
                  await fetchFeeMonths();
                }}
                className="absolute right-12 top-0 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Load Data
              </button>
              <button 
                onClick={async () => {
                  try {
                    const result = await callBackend('SETUP', {});
                    console.log('Setup result:', result);
                    alert('Setup completed: ' + result);
                    await fetchFeeMonths();
                  } catch (e: any) {
                    console.error('Setup error:', e);
                    alert('Setup failed: ' + e.message);
                  }
                }}
                className="absolute right-0 top-0 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Setup
              </button>
            </div>
            <SectionBox>
              <div className="grid grid-cols-1 md:grid-cols-2 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Month Name*:</div>
                  <div className="flex-1 px-2"><Input value={feeMonthForm.monthName} onChange={(e) => setFeeMonthForm(p => ({ ...p, monthName: e.target.value }))} placeholder="Enter month name" /></div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-32 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Month Order*:</div>
                  <div className="flex-1 px-2"><Input type="number" value={feeMonthForm.monthOrder} onChange={(e) => setFeeMonthForm(p => ({ ...p, monthOrder: e.target.value }))} placeholder="1-12" /></div>
                </div>
              </div>
              <div className="p-3.5 flex justify-center gap-4 bg-white">
                <BlueBtn onClick={async () => {
                  if (!feeMonthForm.monthName.trim()) { alert('Enter Month Name'); return; }
                  if (!feeMonthForm.monthOrder.trim()) { alert('Enter Month Order'); return; }
                  setSubmitting(true);
                  try {
                    let payload = { 
                      feeMonth: feeMonthForm.monthName,
                      monthOrder: parseInt(feeMonthForm.monthOrder),
                      feeStructure: '',
                      feeSubmitDate: '',
                      fine: 0
                    };
                    if (!editingFeeMonthId) {
                      payload.id = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
                    }
                    if (editingFeeMonthId) {
                      await callBackend('UPDATE_DATA', { sheetName: 'month_master', id: editingFeeMonthId, data: payload });
                      alert('Fee Month Updated Successfully');
                      setEditingFeeMonthId(null);
                    } else {
                      await callBackend('SAVE_DATA', { sheetName: 'month_master', data: payload });
                      alert('New Fee Month Added');
                    }
                    setFeeMonthForm({monthName:'', monthOrder:''});
                    await fetchFeeMonths();
                  } catch (e: any) { alert(e.message); }
                  finally { setSubmitting(false); }
                }} disabled={submitting}>
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : (editingFeeMonthId ? 'UPDATE' : 'ADD')}
                </BlueBtn>
                <BlueBtn onClick={() => {
                  setFeeMonthForm({monthName:'', monthOrder:''});
                  setEditingFeeMonthId(null);
                }} color="bg-gray-400">CANCEL</BlueBtn>
              </div>
            </SectionBox>
            
            <div className="mb-6 relative pb-4 mt-8">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Fees Month Wise Details</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
              <p className="text-sm text-gray-500 mt-2">Total records: {feeMonthsList.length}</p>
            </div>
            
            <FeeTable 
              headers={['S.no', 'Month', 'Month Order', 'Edit']}
              data={feeMonthsList.filter(month => 
                feeMonthSearch === '' || 
                (month.feeMonth && month.feeMonth.toLowerCase().includes(feeMonthSearch.toLowerCase()))
              )}
              renderRow={(row: any, i: number) => {
                console.log('Rendering row:', row, 'Index:', i);
                return (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5 text-center text-gray-500 font-bold">{i + 1}</td>
                    <td className="px-8 py-5 font-black text-gray-900">{row.feeMonth || 'N/A'}</td>
                    <td className="px-8 py-5 text-gray-600">{row.monthOrder || 'N/A'}</td>
                    <td className="px-8 py-5">
                      <button onClick={() => {
                        setEditingFeeMonthId(row.id);
                        setFeeMonthForm({
                          monthName: row.feeMonth || '',
                          monthOrder: row.monthOrder ? row.monthOrder.toString() : ''
                        });
                      }} className="px-4 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              }}
            />
          </div>
        )}

        {activeModule === 'fee_structure' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-2xl text-[#2980b9] font-normal uppercase tracking-tight">Fee Structure Details</h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-24 bg-[#2980b9]"></div></div>
              <button 
                onClick={async () => {
                  try {
                    const result = await callBackend('FIX_FEE_STRUCTURE_HEADERS', {});
                    console.log('Fix headers result:', result);
                    alert('Headers fixed: ' + result);
                  } catch (e: any) {
                    console.error('Fix headers error:', e);
                    alert('Fix failed: ' + e.message);
                  }
                }}
                className="absolute right-0 top-0 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Fix Headers
              </button>
            </div>
            
            <SectionBox>
              <div className="grid grid-cols-1 md:grid-cols-5 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">School*:</div>
                  <div className="flex-1 px-2">
                    <Select value={feeStructureForm.school} onChange={(e) => setFeeStructureForm(p => ({ ...p, school: e.target.value }))}>
                      <option value="NORMAL MAX TEST ADMIN">NORMAL MAX TEST ADMIN</option>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Branch*:</div>
                  <div className="flex-1 px-2">
                    <Select value={feeStructureForm.branch} onChange={(e) => setFeeStructureForm(p => ({ ...p, branch: e.target.value }))}>
                      <option value="Normal Max Test Admin">Normal Max Test Admin</option>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Batch*:</div>
                  <div className="flex-1 px-2">
                    <Select value={feeStructureForm.batch} onChange={(e) => setFeeStructureForm(p => ({ ...p, batch: e.target.value }))}>
                      <option value="">--- Select ---</option>
                      {finYearsList.map(fy => <option key={fy.id} value={fy.financialYear}>{fy.financialYear}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Class*:</div>
                  <div className="flex-1 px-2">
                    <Select value={feeStructureForm.class} onChange={(e) => setFeeStructureForm(p => ({ ...p, class: e.target.value }))}>
                      <option value="">--- Select ---</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-24 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Month*:</div>
                  <div className="flex-1 px-2">
                    <Select value={feeStructureForm.monthName} onChange={(e) => setFeeStructureForm(p => ({ ...p, monthName: e.target.value }))}>
                      <option value="">---Select---</option>
                      <option value="Baisakh">Baisakh</option>
                      <option value="Jestha">Jestha</option>
                      <option value="Ashadh">Ashadh</option>
                      <option value="Shrawan">Shrawan</option>
                      <option value="Bhadra">Bhadra</option>
                      <option value="Ashoj">Ashoj</option>
                      <option value="Kartik">Kartik</option>
                      <option value="Mangsir">Mangsir</option>
                      <option value="Poush">Poush</option>
                      <option value="Magh">Magh</option>
                      <option value="Falgun">Falgun</option>
                      <option value="Chaitra">Chaitra</option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="p-3.5 flex justify-center gap-4 bg-white">
                <BlueBtn onClick={async () => {
                  if (!feeStructureForm.batch || !feeStructureForm.class) {
                    alert('Please select Batch and Class to search');
                    return;
                  }
                  setLoading(true);
                  try {
                    const results = await callBackend('SEARCH_FEE_STRUCTURE', { 
                      criteria: { 
                        batch: feeStructureForm.batch, 
                        class: feeStructureForm.class 
                      } 
                    });
                    if (results.length > 0) {
                      // Load search results into fee heads table
                      const updatedFeeHeads = [...feeHeadsData];
                      results.forEach(result => {
                        const index = updatedFeeHeads.findIndex(fh => fh.id === result.feeHeadId);
                        if (index !== -1) {
                          updatedFeeHeads[index] = {
                            ...updatedFeeHeads[index],
                            applyDDCharges: result.applyDDCharges || 'None',
                            general: result.general || 0,
                            twentyFivePercent: result.twentyFivePercent || 0,
                            fiftyPercent: result.fiftyPercent || 0,
                            outOfThree: result.outOfThree || 0
                          };
                        }
                      });
                      setFeeHeadsData(updatedFeeHeads);
                      alert(`Found ${results.length} records and loaded into table`);
                    } else {
                      alert('No records found');
                    }
                  } catch (e: any) {
                    alert(`Search failed: ${e.message}`);
                  } finally {
                    setLoading(false);
                  }
                }} disabled={loading} color="bg-green-600">
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <><Search size={12} /> SEARCH</>}
                </BlueBtn>
              </div>
            </SectionBox>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Apply DD Charges</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">id</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">feehead</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">GENERAL</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">TwentyFivePercent</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">fiftyPercent</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Outofthree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {feeHeadsData.map((feeHead, idx) => (
                      <tr key={feeHead.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <Select 
                            value={feeHead.applyDDCharges || "None"}
                            onChange={(e) => updateFeeHead(idx, 'applyDDCharges', e.target.value)}
                          >
                            <option value="None">None</option>
                            <option value="Must">Must</option>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 font-mono">{feeHead.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{feeHead.name}</td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number" 
                            value={feeHead.general || "0"} 
                            className="w-20" 
                            onChange={(e) => updateFeeHead(idx, 'general', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number" 
                            value={feeHead.twentyFivePercent || "0"} 
                            className="w-20" 
                            onChange={(e) => updateFeeHead(idx, 'twentyFivePercent', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number" 
                            value={feeHead.fiftyPercent || "0"} 
                            className="w-20" 
                            onChange={(e) => updateFeeHead(idx, 'fiftyPercent', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number" 
                            value={feeHead.outOfThree || "0"} 
                            className="w-20" 
                            onChange={(e) => updateFeeHead(idx, 'outOfThree', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="px-4 py-3 text-right">Total Fees</td>
                      <td className="px-4 py-3">{totals.general}</td>
                      <td className="px-4 py-3">{totals.twentyFivePercent}</td>
                      <td className="px-4 py-3">{totals.fiftyPercent}</td>
                      <td className="px-4 py-3">{totals.outOfThree}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center gap-4">
              <BlueBtn onClick={saveFeeStructure} disabled={submitting}>
                {submitting ? <Loader2 size={12} className="animate-spin" /> : 'SAVE'}
              </BlueBtn>
              <BlueBtn onClick={resetFeeStructure} color="bg-gray-400">
                RESET
              </BlueBtn>
            </div>
          </div>
        )}

        {activeModule === 'due_student_fee' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Due Student Fee
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <SectionBox>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">School :</label>
                  <Select defaultValue="NORMAL MAX TEST ADMIN">
                    <option value="NORMAL MAX TEST ADMIN">NORMAL MAX TEST ADMIN</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Branch :</label>
                  <Select defaultValue="Normal Max Test Admin">
                    <option value="Normal Max Test Admin">Normal Max Test Admin</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Batch :</label>
                  <Select>
                    <option value="">--- Select ---</option>
                    {finYearsList.map(fy => <option key={fy.id} value={fy.financialYear}>{fy.financialYear}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Class :</label>
                  <Select>
                    <option value="">--- Select ---</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Section :</label>
                  <Select>
                    <option value="">---Select---</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">First Name :</label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Month Name :</label>
                  <Select>
                    <option value="">--select--</option>
                    <option value="Baisakh">Baisakh</option>
                    <option value="Jestha">Jestha</option>
                    <option value="Ashadh">Ashadh</option>
                    <option value="Shrawan">Shrawan</option>
                    <option value="Bhadra">Bhadra</option>
                    <option value="Ashoj">Ashoj</option>
                    <option value="Kartik">Kartik</option>
                    <option value="Mangsir">Mangsir</option>
                    <option value="Poush">Poush</option>
                    <option value="Magh">Magh</option>
                    <option value="Falgun">Falgun</option>
                    <option value="Chaitra">Chaitra</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Fee Category :</label>
                  <Select>
                    <option value="">------Select--------</option>
                    {feeHeadsList.map(fh => <option key={fh.id} value={fh.feeHead}>{fh.feeHead}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Enrolment No :</label>
                  <Input placeholder="Enter enrolment number" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Pay Till :</label>
                  <Input type="date" />
                </div>
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                <BlueBtn onClick={() => alert('Search Due Student Fee')}>
                  <SearchIcon size={12} /> SEARCH
                </BlueBtn>
                <BlueBtn onClick={() => alert('Reset Form')} color="bg-gray-400">
                  RESET
                </BlueBtn>
              </div>
            </SectionBox>
          </div>
        )}

        {activeModule === 'student_fee_submit' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Student Fees Submit Details
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <SectionBox>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">School :</label>
                  <Select defaultValue="NORMAL MAX TEST ADMIN">
                    <option value="NORMAL MAX TEST ADMIN">NORMAL MAX TEST ADMIN</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Branch :</label>
                  <Select defaultValue="Normal Max Test Admin">
                    <option value="Normal Max Test Admin">Normal Max Test Admin</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Fee Category :</label>
                  <Select>
                    <option value="">------Select--------</option>
                    {feeHeadsList.map(fh => <option key={fh.id} value={fh.feeHead}>{fh.feeHead}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Batch :</label>
                  <Select defaultValue="2080">
                    <option value="2080">2080</option>
                    {finYearsList.map(fy => <option key={fy.id} value={fy.financialYear}>{fy.financialYear}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Class :</label>
                  <Select>
                    <option value="">--- Select ---</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Section :</label>
                  <Select>
                    <option value="">--- Select ---</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">First Name :</label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Roll Number :</label>
                  <Input placeholder="Enter roll number" />
                </div>
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                <BlueBtn onClick={() => alert('Search Student Fee Submit')}>
                  <SearchIcon size={12} /> SEARCH
                </BlueBtn>
                <BlueBtn onClick={() => alert('Reset Form')} color="bg-gray-400">
                  RESET
                </BlueBtn>
              </div>
            </SectionBox>
          </div>
        )}

        {activeModule === 'view_student_fee_details' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                View Student Fees Details
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-bold text-gray-700 mb-4">Search Student</h3>
            </div>

            <SectionBox>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">School :</label>
                  <Select defaultValue="NORMAL MAX TEST ADMIN">
                    <option value="NORMAL MAX TEST ADMIN">NORMAL MAX TEST ADMIN</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Branch :</label>
                  <Select defaultValue="Normal Max Test Admin">
                    <option value="Normal Max Test Admin">Normal Max Test Admin</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Batch :</label>
                  <Select defaultValue="2080">
                    <option value="2080">2080</option>
                    {finYearsList.map(fy => <option key={fy.id} value={fy.financialYear}>{fy.financialYear}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Class :</label>
                  <Select>
                    <option value="">--- Select ---</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Section :</label>
                  <Select>
                    <option value="">---Select---</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Instalment Name :</label>
                  <Select>
                    <option value="">---Select---</option>
                    <option value="First Instalment">First Instalment</option>
                    <option value="Second Instalment">Second Instalment</option>
                    <option value="Third Instalment">Third Instalment</option>
                    <option value="Final Instalment">Final Instalment</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Fee Category :</label>
                  <Select>
                    <option value="">------Select--------</option>
                    {feeHeadsList.map(fh => <option key={fh.id} value={fh.feeHead}>{fh.feeHead}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">First Name :</label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Student ID :</label>
                  <Input placeholder="Enter student ID" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">From Date :</label>
                  <Input type="date" defaultValue="2026-01-13" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">To Date :</label>
                  <Input type="date" defaultValue="2026-01-13" />
                </div>
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                <BlueBtn onClick={() => alert('Search Student Fee Details')}>
                  <SearchIcon size={12} /> SEARCH
                </BlueBtn>
                <BlueBtn onClick={() => alert('Reset Form')} color="bg-gray-400">
                  RESET
                </BlueBtn>
              </div>
            </SectionBox>
          </div>
        )}

        {activeModule === 'daily_fee_receipt_register' && (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Daily Fee Receipt Register
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <SectionBox>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">School :</label>
                  <Select defaultValue="NORMAL MAX TEST ADMIN">
                    <option value="NORMAL MAX TEST ADMIN">NORMAL MAX TEST ADMIN</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Branch :</label>
                  <Select defaultValue="Normal Max Test Admin">
                    <option value="Normal Max Test Admin">Normal Max Test Admin</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Batch :</label>
                  <Select defaultValue="2080">
                    <option value="2080">2080</option>
                    {finYearsList.map(fy => <option key={fy.id} value={fy.financialYear}>{fy.financialYear}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Class :</label>
                  <Select>
                    <option value="">--- Select ---</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Instalment Name :</label>
                  <Select>
                    <option value="">---Select---</option>
                    <option value="First Instalment">First Instalment</option>
                    <option value="Second Instalment">Second Instalment</option>
                    <option value="Third Instalment">Third Instalment</option>
                    <option value="Final Instalment">Final Instalment</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Fee Category :</label>
                  <Select>
                    <option value="">------Select--------</option>
                    {feeHeadsList.map(fh => <option key={fh.id} value={fh.feeHead}>{fh.feeHead}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">First Name :</label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Student ID :</label>
                  <Input placeholder="Enter student ID" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">From Date :</label>
                  <Input type="date" defaultValue="2026-01-13" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">To Date :</label>
                  <Input type="date" defaultValue="2026-01-13" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">Mode :</label>
                  <Select>
                    <option value="">--Select--</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </Select>
                </div>
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                <BlueBtn onClick={() => alert('Search Daily Fee Receipt Register')}>
                  <SearchIcon size={12} /> SEARCH
                </BlueBtn>
                <BlueBtn onClick={() => alert('Reset Form')} color="bg-gray-400">
                  RESET
                </BlueBtn>
              </div>
            </SectionBox>
          </div>
        )}

        {activeModule === 'submit' && (
          <div className="h-[500px] flex flex-col items-center justify-center text-gray-300 font-black uppercase tracking-[0.2em] space-y-4">
             <Receipt size={48} className="opacity-20" />
             <p>Select Student to Generate Billing</p>
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Fees;