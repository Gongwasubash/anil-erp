
import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  LayoutGrid, 
  List, 
  FileText,
  Printer,
  ChevronRight,
  School
} from 'lucide-react';
import { User } from '../types';
import { calculateGrade, formatCurrency } from '../constants';

const MOCK_SUBJECTS = [
  { id: '1', name: 'Mathematics', fm: 100, pm: 35, type: 'Theory' },
  { id: '2', name: 'Science', fm: 75, pm: 25, type: 'Theory' },
  { id: '3', name: 'Social Studies', fm: 100, pm: 35, type: 'Theory' },
  { id: '4', name: 'English', fm: 100, pm: 35, type: 'Theory' },
  { id: '5', name: 'Computer', fm: 50, pm: 18, type: 'Theory' },
];

// Added interface for component props to resolve potential type errors in App.tsx
interface ExamsProps {
  user: User;
}

const Exams: React.FC<ExamsProps> = ({ user }) => {
  const [view, setView] = useState<'list' | 'entry'>('list');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const mockResults = [
    { subject: 'Mathematics', theory: 92, practical: 0, total: 92 },
    { subject: 'Science', theory: 68, practical: 22, total: 90 },
    { subject: 'Social Studies', theory: 84, practical: 0, total: 84 },
    { subject: 'English', theory: 78, practical: 0, total: 78 },
    { subject: 'Computer Science', theory: 45, practical: 48, total: 93 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Center</h1>
          <p className="text-gray-500">Enter marks, calculate GPA and print Nepali style marksheets.</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
           <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             Reports
           </button>
           <button 
            onClick={() => setView('entry')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'entry' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             Marks Entry
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Class/Subject Selector */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Configuration</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Academic Year</label>
                  <select className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm font-medium">
                    <option>2080 B.S.</option>
                    <option>2079 B.S.</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Term / Exam</label>
                  <select className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm font-medium">
                    <option>First Terminal</option>
                    <option>Half Yearly</option>
                    <option>Final Examination</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Class</label>
                  <select className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm font-medium">
                    <option>Grade 10</option>
                    <option>Grade 9</option>
                  </select>
                </div>
             </div>
           </div>

           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-4 bg-gray-50 border-b">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Student List</h3>
             </div>
             <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {[
                  { name: 'Aarav Sharma', roll: '01' },
                  { name: 'Ishani Rai', roll: '02' },
                  { name: 'Kabir Thapa', roll: '03' },
                  { name: 'Sita Ram', roll: '04' },
                ].map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-center justify-between group ${selectedStudent?.name === s.name ? 'bg-blue-50' : ''}`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700">{s.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Roll: {s.roll}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400" />
                  </button>
                ))}
             </div>
           </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          {selectedStudent ? (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl">
                        {selectedStudent.name[0]}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                        <p className="text-sm text-gray-500">Grade 10 • Roll No: {selectedStudent.roll} • Academic Year 2080</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                   >
                     <Printer size={18} />
                     Print Marksheet
                   </button>
                </div>

                {/* Marksheet Layout (Screen Version) */}
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm" id="marksheet-print">
                   <div className="text-center mb-10">
                      <div className="flex items-center justify-center gap-3 mb-2">
                         <School className="text-blue-600" size={32} />
                         <h1 className="text-3xl font-black text-gray-800 tracking-tight">EVEREST SECONDARY SCHOOL</h1>
                      </div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Kathmandu, Nepal • Estd. 1995</p>
                      <div className="inline-block mt-4 px-8 py-1.5 border-2 border-blue-600 rounded-full">
                         <h2 className="text-lg font-black text-blue-600 uppercase">Grade Sheet</h2>
                      </div>
                   </div>

                   <table className="w-full border-collapse border border-gray-800 text-center text-sm font-medium">
                      <thead className="bg-gray-50">
                        <tr>
                           <th className="border border-gray-800 p-3" rowSpan={2}>SN</th>
                           <th className="border border-gray-800 p-3" rowSpan={2}>Subject</th>
                           <th className="border border-gray-800 p-3" colSpan={3}>Obtained Grade</th>
                           <th className="border border-gray-800 p-3" rowSpan={2}>Grade Point</th>
                        </tr>
                        <tr>
                           <th className="border border-gray-800 p-2">TH</th>
                           <th className="border border-gray-800 p-2">PR</th>
                           <th className="border border-gray-800 p-2">Final</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockResults.map((r, i) => {
                          const grade = calculateGrade((r.total / 100) * 100);
                          return (
                            <tr key={i}>
                               <td className="border border-gray-800 p-3">{i+1}</td>
                               <td className="border border-gray-800 p-3 text-left font-bold">{r.subject}</td>
                               <td className="border border-gray-800 p-3">{calculateGrade(r.theory).grade}</td>
                               <td className="border border-gray-800 p-3">{r.practical > 0 ? calculateGrade(r.practical).grade : '-'}</td>
                               <td className="border border-gray-800 p-3 font-bold">{grade.grade}</td>
                               <td className="border border-gray-800 p-3">{grade.gpa.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                           <td className="border border-gray-800 p-3 font-black uppercase text-left" colSpan={4}>Grade Point Average (GPA)</td>
                           <td className="border border-gray-800 p-3 font-black text-xl" colSpan={2}>3.72</td>
                        </tr>
                      </tfoot>
                   </table>

                   <div className="mt-16 flex justify-between px-10">
                      <div className="text-center">
                         <div className="w-40 border-b border-gray-900 mb-2"></div>
                         <p className="text-xs font-bold uppercase">Class Teacher</p>
                      </div>
                      <div className="text-center">
                         <div className="w-40 border-b border-gray-900 mb-2"></div>
                         <p className="text-xs font-bold uppercase">Principal</p>
                      </div>
                   </div>
                </div>
             </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
               <ClipboardCheck size={64} className="mb-4 opacity-10" />
               <p className="font-bold text-lg">Select a student from the list</p>
               <p className="text-sm">View or manage their academic performance records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exams;
