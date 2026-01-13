import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { User } from '../types';

// UI Components
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

interface Grade {
  id: string;
  gradeName: string;
  minPercent: number;
  maxPercent: number;
  gradePoint: number;
  minGPoint: number;
  maxGPoint: number;
  description: string;
  teacherRemarks: string;
}

const Exams: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState(() => {
    const path = location.pathname;
    if (path.includes('manage_grade')) return 'manage_grade';
    return 'manage_grade';
  });

  const [gradeForm, setGradeForm] = useState({
    gradeName: ''
  });

  const [gradesList] = useState<Grade[]>([
    { id: '1', gradeName: 'E', minPercent: 0, maxPercent: 19.99, gradePoint: 0.8, minGPoint: 0, maxGPoint: 0.8, description: 'Very Insufficient', teacherRemarks: '' },
    { id: '2', gradeName: 'D', minPercent: 20, maxPercent: 29.99, gradePoint: 1.2, minGPoint: 0.81, maxGPoint: 1.2, description: 'Insufficient', teacherRemarks: '' },
    { id: '3', gradeName: 'D+', minPercent: 30, maxPercent: 39.99, gradePoint: 1.6, minGPoint: 1.21, maxGPoint: 1.6, description: 'Partially Acceptable', teacherRemarks: '' },
    { id: '4', gradeName: 'C', minPercent: 40, maxPercent: 49.99, gradePoint: 2, minGPoint: 1.61, maxGPoint: 2, description: 'Acceptable', teacherRemarks: '' },
    { id: '5', gradeName: 'C+', minPercent: 50, maxPercent: 59.99, gradePoint: 2.4, minGPoint: 2.01, maxGPoint: 2.4, description: 'Satisfactory', teacherRemarks: '' },
    { id: '6', gradeName: 'B', minPercent: 60, maxPercent: 69.99, gradePoint: 2.8, minGPoint: 2.41, maxGPoint: 2.8, description: 'Good', teacherRemarks: '' },
    { id: '7', gradeName: 'B+', minPercent: 70, maxPercent: 79.99, gradePoint: 3.2, minGPoint: 2.81, maxGPoint: 3.2, description: 'Very Good', teacherRemarks: '' },
    { id: '8', gradeName: 'A', minPercent: 80, maxPercent: 89.99, gradePoint: 3.6, minGPoint: 3.21, maxGPoint: 3.6, description: 'Excellent', teacherRemarks: '' },
    { id: '9', gradeName: 'A+', minPercent: 90, maxPercent: 100, gradePoint: 4, minGPoint: 3.61, maxGPoint: 4, description: 'Outstanding', teacherRemarks: '' }
  ]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('manage_grade')) setActiveModule('manage_grade');
  }, [location.pathname]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Examination Management</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage grades, exams, marks and results</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
            <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Quick Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          {activeModule === 'manage_grade' && (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Manage Grade
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="grid grid-cols-1 border-b">
                  <div className="flex flex-col lg:flex-row lg:items-center h-auto lg:h-10 bg-white py-2 lg:py-0">
                    <div className="w-full lg:w-32 bg-gray-50 h-8 lg:h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 lg:border-r mb-1 lg:mb-0">Grade Name:</div>
                    <div className="flex-1 px-0 lg:px-2"><Input value={gradeForm.gradeName} onChange={(e) => setGradeForm(p => ({ ...p, gradeName: e.target.value }))} placeholder="Enter grade name" /></div>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
                  <BlueBtn onClick={() => alert('Add Grade')}>
                    ADD
                  </BlueBtn>
                  <BlueBtn onClick={() => setGradeForm({ gradeName: '' })} color="bg-gray-400">
                    CANCEL
                  </BlueBtn>
                </div>
              </SectionBox>

              <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-white border-b">
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">S.No.</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Edit</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Delete</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Grade Name</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Min %</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Max %</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Grade Point</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Min G point</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Max G point</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Description</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {gradesList.map((grade, idx) => (
                        <tr key={grade.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-center text-gray-500 font-bold">{idx + 1}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                              <Edit size={18} />
                            </button>
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{grade.gradeName}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.minPercent}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.maxPercent}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.gradePoint}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.minGPoint}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.maxGPoint}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.description}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{grade.teacherRemarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exams;